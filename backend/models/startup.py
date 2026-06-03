from pydantic import BaseModel


class StartupIdea(BaseModel):

    startup_name: str

    industry: str

    problem: str

    solution: str

    target_audience: str

    revenue_model: str

    competitors: str