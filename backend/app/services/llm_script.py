# llm_script.py
from typing import Dict, List
import yaml
from openai import OpenAI, OpenAIError
from jinja2 import Template


from app.models.workflow import Workflow
from app.core.config import settings
from app.core.logger import logger

def load_prompt_templates(path="prompt_templates.yaml"):
    with open(path, "r") as f:
        doc = yaml.safe_load(f)
    return doc["ad_variations"]  # returns a dict[str,str]


async def generate_scripts(workflow: Workflow) -> Dict[str, str]:
    """
    Takes in the workflow object and generates a dict of openai prompts
    returns dict of {variation: prompt}
    """
    logger.info("Loading prompts")
    templates = load_prompt_templates()

    results: dict[str, str] = {}
    for variation, tmpl_str in templates.items():
        # render the template
        tmpl = Template(tmpl_str)
        prompt = tmpl.render(
            name=workflow.product.product_name,
            description=workflow.product.product_description,
        )

        logger.info("tmpl created")

        client = OpenAI(
            api_key= settings.OPENAI_API_KEY
        )
        logger.info(f"{settings.OPENAI_API_KEY}")

        # call OpenAI
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an ad-copy generator."},
                {"role": "user",   "content": prompt},
            ],
            temperature=0.7,
            max_tokens=150,
        )

        logger.info(resp)

        script = str(resp.choices[0].message.content).strip()
        results[variation] = script

    return results

