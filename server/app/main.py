from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.models import Item
from app.schemas import ItemCreate, ItemRead

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scaler Assignment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/items", response_model=list[ItemRead])
def list_items(db: Session = Depends(get_db)) -> list[Item]:
    return db.query(Item).all()


@app.post("/items", response_model=ItemRead, status_code=201)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)) -> Item:
    item = Item(name=payload.name, description=payload.description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.get("/items/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: Session = Depends(get_db)) -> Item:
    item = db.get(Item, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
