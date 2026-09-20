import type { Request, Response } from "express";
import Card from "../models/card.js";

const withIsLiked = (card: InstanceType<typeof Card>, userId?: string) => ({
  ...card.toObject(),
  isLiked: card.likes.some((id) => id.toString() === userId),
});

export const getCards = async (req: Request, res: Response) => {
  const cards = await Card.find({});
  const userId = req.user?._id;
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
  const card = await Card.findByIdAndDelete(req.params.id);

  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
      statusCode: 404,
    });
  }

  res.send(withIsLiked(card, req.user?._id));
};

export const likeCard = async (req: Request, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  );

  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
      statusCode: 404,
    });
  }

  res.send(withIsLiked(card, req.user?._id));
};

export const dislikeCard = async (req: Request, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user?._id } },
    { new: true },
  );

  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
      statusCode: 404,
    });
  }

  res.send(withIsLiked(card, req.user?._id));
};
