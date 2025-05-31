const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
     cloud_name: 'dobcvvl12',
     api_key: '466325441383313',
     api_secret: 'yLs-5oPUu6EeVXoY3yysRxDYfDw'
});

// Create the upload preset
async function createUploadPreset() {
     try {
          const result = await cloudinary.api.create_upload_preset({
               name: 'ml_default',
               unsigned: true,
               folder: '',
               allowed_formats: 'jpg,jpeg,png,webp',
               max_file_size: 5000000, // 5MB
          });

          console.log('✅ Upload preset created successfully!');
          console.log(result);
     } catch (error) {
          if (error.error && error.error.message.includes('already exists')) {
               console.log('⚠️ Preset already exists. Updating it instead...');

               try {
                    const updateResult = await cloudinary.api.update_upload_preset('ml_default', {
                         unsigned: true,
                         folder: '',
                         allowed_formats: 'jpg,jpeg,png,webp',
                         max_file_size: 5000000, // 5MB
                    });

                    console.log('✅ Upload preset updated successfully!');
                    console.log(updateResult);
               } catch (updateError) {
                    console.error('❌ Error updating preset:', updateError);
               }
          } else {
               console.error('❌ Error creating preset:', error);
          }
     }
}

// Run the function
createUploadPreset(); 