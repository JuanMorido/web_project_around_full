import type { Request, Response } from "express";
import Card from "../models/card.js";

const withIsLiked = (card: InstanceType<typeof Card>, userId?: string) => {
  const data = card.toObject();
  return {
    ...data,
    owner: data.owner.toString(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  };
};

const getOwnedCard = async (req: Request) => {
  const card = await Card.findById(req.params.id);

  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
      statusCode: 404,
    });
  }

  if (card.owner.toString() !== req.user?._id) {
    throw Object.assign(
      new Error("No tienes permiso para modificar esta tarjeta"),
      { statusCode: 403 },
    );
  }

  return card;
};

export const getCards = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const cards = await Card.find({ owner: userId }).sort({ createdAt: -1 });
  res.send(cards.map((card) => withIsLiked(card, userId)));
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const card = await Card.create({
    name,
    link,
    owner: req.user?._id,
  });
  res.status(201).send(withIsLiked(card, req.user?._id));
};

export const deleteCard = async (req: Request, res: Response) => {
  const card = await getOwnedCard(req);
  await card.deleteOne();
  res.send(withIsLiked(card, req.user?._id));
};

export const likeCard = async (req: Request, res: Response) => {
  await getOwnedCard(req);
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  );
  res.send(withIsLiked(card!, req.user?._id));
};

export const dislikeCard = async (req: Request, res: Response) => {
  await getOwnedCard(req);
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user?._id } },
    { new: true },
  );
  res.send(withIsLiked(card!, req.user?._id));
};
