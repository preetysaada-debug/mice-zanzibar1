const mysql = require('mysql2/promise');

async function updateHotels() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mice_zanzibar'
  });

  try {
    // Delete existing hotels
    await connection.execute('DELETE FROM hotels');
    
    // Insert new hotels with images
    const hotels = [
      ['Stone Town Hotel', 'Stone Town', 150, '$$$', 'Historic hotel in the heart of Stone Town with elegant courtyard ambiance', '/images/hotel1.jpeg', 'stonetown@zanzibar.com'],
      ['Nungwi Beach Resort', 'Nungwi', 300, '$$$$', 'Luxury beachfront resort with world-class water sports and activities', '/images/hotel2.jpeg', 'nungwi@zanzibar.com'],
      ['Jambiani Conference Center', 'Jambiani', 200, '$$$', 'Modern conference facilities with beautiful beach views and premium services', '/images/hotel7.jpeg', 'jambiani@zanzibar.com']
    ];

    for (const hotel of hotels) {
      await connection.execute(
        'INSERT INTO hotels (name, location, capacity, price_range, description, image_url, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
        hotel
      );
    }

    console.log('✅ Hotels updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating hotels:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateHotels();
