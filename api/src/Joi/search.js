import Joi from 'joi';

export const getMovies = Joi.object().keys({
  yearMin: Joi.number().min(1900).max(2016),
  yearMax: Joi.number().min(1901).max(2017),
  rateMin: Joi.number().min(0).max(9),
  rateMax: Joi.number().min(1).max(10),
  genre: Joi.string().regex(/^[a-zA-Z-]+/).allow(''),
  title: Joi.string().alphanum().allow(''),
  asc: Joi.number().allow(''),
  page: Joi.number().min(0),
  sort: Joi.string().alphanum().min(1).max(40),
  sorted: Joi.number(),
  scroll: Joi.number(),
});

export const getSeries = Joi.object().keys({
  yearMin: Joi.number().min(1900).max(2016),
  yearMax: Joi.number().min(1901).max(2017),
  rateMin: Joi.number().min(0).max(9),
  rateMax: Joi.number().min(1).max(10),
  genre: Joi.string().allow(''),
  title: Joi.string().alphanum().allow(''),
  asc: Joi.number().allow(''),
  page: Joi.number().min(0),
  sort: Joi.string().alphanum().min(1).max(40),
  sorted: Joi.number(),
  scroll: Joi.number(),
});
