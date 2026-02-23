// Hotel Controller
exports.getAllHotels = (req, res) => {
  const query = "SELECT * FROM hotels";
  
  req.db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      success: true,
      data: result,
      count: result.length
    });
  });
};

exports.getHotelById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM hotels WHERE id = ?";
  
  req.db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json({
      success: true,
      data: result[0]
    });
  });
};
