
export const create=async({model,data})=>{
   return await model.create(data);
}
export const findOne=async({model, filter={},options={}}={})=>{
   const doc = model.findOne(filter)

   if(options.populate){
      doc.populate(options.populate)
   }
   if(options.skip){
      doc.skip(options.skip)
   }
   if(options.limit){
      doc.limit(options.limit)
   }
   return await doc.exec()
}

export const findById = async ({ model, id, options = {} } = {}) => {
  const doc = model.findById(id);

  if (options.populate) {
    doc.populate(options.populate);
  }
  if (options.select) {
    doc.select(options.select);
  }

  return await doc.exec();
};
export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = {},
  select,
  populate,
} = {}) => {
  const query = model.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    ...options,
  });

  if (populate) query.populate(populate);
  if (select) query.select(select);

  return await query.exec();
};
export const deleteOne=async({model,filter={}}={})=>{
  return await model.deleteOne(filter)
};
export const deleteMany=async({model,filter={}}={})=>{
  return await model.deleteMany(filter)
}