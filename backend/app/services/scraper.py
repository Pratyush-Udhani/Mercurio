from playwright.async_api import async_playwright
from pydantic import HttpUrl as Url
from app.models.product import ProductInfo

async def scrape_amazon(url: str) -> ProductInfo:
    """
    Launches a headless browser, navigates to the URL,
    extracts product title, description, and main images.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, timeout=60000, wait_until="domcontentloaded")

        # Extract title
        title = await page.text_content("#productTitle") or ""
        # Extract description (fallback to bullet-points if needed)
        desc = await page.text_content("#productDescription")
        if not desc:
            bullets = await page.eval_on_selector_all(
                "#feature-bullets ul li span", "els => els.map(el => el.textContent.trim())"
            )
            desc = " ".join(bullets)

        # Extract main images
        img_handles = await page.query_selector_all(
            "div#main-image-container img.a-dynamic-image"
        )
        image_urls = []
        for img in img_handles:
            src = await img.get_attribute("src")
            if src:
                image_urls.append(src)

        await browser.close()

        return ProductInfo(
            product_name=title.strip(),
            product_description=desc.strip(),
            images=image_urls,
        ) 

        # return ProductInfo(
        #     product_name="Testing Name",
        #     product_description="Testing description",
        #     images=[Url("https://url1.com"), Url("https://url2.com")],
        # )

