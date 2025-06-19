from playwright.async_api import async_playwright
from app.models.product import ProductInfo
from app.core.logger import logger
import re

# Regex to match Amazon size tokens like _SS40_, _SX425_
SIZE_PATTERN = re.compile(r"_(?:SX|SS)\d+_")
TARGET_SIZE = "_SS500_"

async def scrape_amazon(url: str) -> ProductInfo:
    """
    Launches a headless browser, navigates to the URL,
    extracts product title, description, and images.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            await page.goto(url, timeout=60000, wait_until="domcontentloaded")

            # Extract title
            title = await page.text_content("#productTitle") or ""
            # Extract description (fallback to bullet-points if needed)
            desc = await page.text_content("#productDescription")
            bullets = await page.eval_on_selector_all(
                "#feature-bullets ul li span", "els => els.map(el => el.textContent.trim())"
            )
            desc = " ".join(bullets)

            # Extract images
            image_urls = []

            main_handles = await page.query_selector_all(
                "div#main-image-container img.a-dynamic-image"
            )

            for img in main_handles:
                src = await img.get_attribute("src")
                if src:
                    image_urls.append(src)

            alt_handles = await page.query_selector_all(
                "div#altImages li img"
            )

            for img in alt_handles:
                src = await img.get_attribute("src")
                if src:
                    image_urls.append(src)

            logger.info(f"Extracted {len(image_urls)} images for {title.strip()}")

        except Exception as e:
            logger.error(f"Error during scraping {url}: {e}", exc_info=True)
            raise
        finally:
            await browser.close()

        normalized = []
        for raw in image_urls:
            # Replace any size token with the desired one
            new_url = SIZE_PATTERN.sub(TARGET_SIZE, raw)
            if new_url not in normalized:
                normalized.append(new_url)

        return ProductInfo(
            product_name=title.strip(),
            product_description=desc.strip(),
            images=normalized,
        ) 

        # return ProductInfo(
        #     product_name="Testing Name",
        #     product_description="Testing description",
        #     images=[Url("https://url1.com"), Url("https://url2.com")],
        # )

