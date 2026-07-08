from fastapi import FastAPI, HTTPException, status
from app.schemas import IncidentPayload, OperationalResponse
from app.agents import process_stadium_request

app = FastAPI(
    title="OmniStadium GenAI Framework - FIFA World Cup 2026",
    version="1.0.0",
    description="GenAI orchestration backend for tournament operations optimization."
)

@app.post(
    "/api/v1/stadium/dispatch", 
    response_model=OperationalResponse, 
    status_code=status.HTTP_200_OK,
    summary="Process and route real-time operational requests"
)
async def dispatch_stadium_incident(payload: IncidentPayload):
    try:
        engine_output = process_stadium_request(payload)
        return OperationalResponse(
            status=engine_output["status"],
            routing_instructions=engine_output["routing"],
            staff_dispatch_action=engine_output["dispatch"],
            safety_risk_assessment=engine_output["risk"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal AI Orchestration Error: {str(e)}")