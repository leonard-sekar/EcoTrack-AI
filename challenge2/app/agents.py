import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from app.schemas import IncidentPayload

# Secure LLM Initialization (Expects OPENAI_API_KEY environment variable)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

ROUTER_SYSTEM_PROMPT = """You are the master routing agent for the FIFA World Cup 2026 OmniStadium Operations Center.
Your task is to classify incoming user intents into one of three domains:
1. CROWD_DYNAMIC: Bottlenecks, transit delays, exit congestion, blockages.
2. ACCESSIBILITY_NAV: Wheelchair ramps, language barriers, sensory room inquiries.
3. ORGANIZER_SOP: Staff deployments, security alerts, operational anomalies.

Respond with exactly one keyword: CROWD_DYNAMIC, ACCESSIBILITY_NAV, or ORGANIZER_SOP."""

router_prompt = ChatPromptTemplate.from_messages([
    ("system", ROUTER_SYSTEM_PROMPT),
    ("human", "{query}")
])

# Specialist Expert Prompts
CROWD_PROMPT = "You are an expert in crowd dynamics and transit. Provide optimized, clear guidance for: {query} at {location}."
ACCESSIBILITY_PROMPT = "You are an accessibility and translation specialist. Map sensory & path requirements cleanly for: {query} at {location}. Language context: {lang}."
SOP_PROMPT = "You are the Senior Tournament Director. Formulate immediate structural step-by-step mitigation plans according to FIFA safety guidelines for: {query} at {location}."

def process_stadium_request(payload: IncidentPayload) -> dict:
    # 1. Classify Intent using Router Agent
    router_chain = router_prompt | llm
    classification = router_chain.invoke({"query": payload.query_or_incident}).content.strip()
    
    # 2. Chain of Thought Execution based on Classification
    if "CROWD_DYNAMIC" in classification:
        prompt = ChatPromptTemplate.from_template(CROWD_PROMPT)
        action_chain = prompt | llm
        result = action_chain.invoke({"query": payload.query_or_incident, "location": payload.location_context})
        return {"status": "SUCCESS", "routing": result.content, "dispatch": "Deploy crowd guides to balance exits.", "risk": "Low-to-Medium congestion window"}
        
    elif "ACCESSIBILITY_NAV" in classification:
        prompt = ChatPromptTemplate.from_template(ACCESSIBILITY_PROMPT)
        action_chain = prompt | llm
        result = action_chain.invoke({"query": payload.query_or_incident, "location": payload.location_context, "lang": payload.language})
        return {"status": "SUCCESS", "routing": result.content, "dispatch": "Notify nearest accessibility volunteer zone.", "risk": "Non-emergency accessibility aid"}
        
    else:  # ORGANIZER_SOP
        prompt = ChatPromptTemplate.from_template(SOP_PROMPT)
        action_chain = prompt | llm
        result = action_chain.invoke({"query": payload.query_or_incident, "location": payload.location_context})
        return {"status": "CRITICAL_ACTION_REQUIRED", "routing": "Redirecting civilian vectors safely.", "dispatch": f"SOP TRIGGERED: {result.content}", "risk": "High operational priority"}