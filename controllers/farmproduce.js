const handleGetFarmproduce = (req, res, db) => {
  db.select("*")
    .from("farmproduce")
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json("unable to get the data"));
};

module.exports = {
  handleGetFarmproduce,
};
