// setup.js - Script para configurar la base de datos inicial
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Esquemas (copiados del server.js)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    subscribers: { type: Number, default: 0 },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    filename: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    category: { type: String, default: 'General' },
    isPublic: { type: Boolean, default: true },
    uploadedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);

async function setupDatabase() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zentube');
        console.log('✅ Conexión a MongoDB exitosa');

        // Crear directorios necesarios
        console.log('📁 Creando directorios...');
        const directories = [
            './uploads',
            './uploads/videos',
            './uploads/thumbnails',
            './uploads/avatars',
            './logs'
        ];

        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ Directorio creado: ${dir}`);
            }
        });

        // Crear usuario administrador por defecto
        console.log('👤 Creando usuario administrador...');
        const adminExists = await User.findOne({ username: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                username: 'admin',
                email: 'admin@zentube.com',
                password: hashedPassword,
                subscribers: 1000
            });

            await admin.save();
            console.log('✅ Usuario administrador creado');
            console.log('📧 Email: admin@zentube.com');
            console.log('🔑 Password: admin123');
        } else {
            console.log('ℹ️ Usuario administrador ya existe');
        }

        // Crear algunos videos de ejemplo
        console.log('🎬 Creando videos de ejemplo...');
        const videosCount = await Video.countDocuments();

        if (videosCount === 0) {
            const admin = await User.findOne({ username: 'admin' });

            const sampleVideos = [
                {
                    title: 'Bienvenidos a ZenTube',
                    description: 'Video de bienvenida a nuestra plataforma de videos',
                    filename: 'sample-video-1.mp4',
                    thumbnail: 'sample-thumb-1.jpg',
                    duration: 120,
                    views: 1500,
                    likes: 50,
                    uploader: admin._id,
                    tags: ['bienvenida', 'zentube', 'introducción'],
                    category: 'General'
                },
                {
                    title: 'Tutorial de Programación',
                    description: 'Aprende a programar desde cero',
                    filename: 'sample-video-2.mp4',
                    thumbnail: 'sample-thumb-2.jpg',
                    duration: 300,
                    views: 2500,
                    likes: 120,
                    uploader: admin._id,
                    tags: ['programación', 'tutorial', 'educación'],
                    category: 'Educación'
                },
                {
                    title: 'Música Relajante',
                    description: 'Música para concentrarse y relajarse',
                    filename: 'sample-video-3.mp4',
                    thumbnail: 'sample-thumb-3.jpg',
                    duration: 600,
                    views: 5000,
                    likes: 200,
                    uploader: admin._id,
                    tags: ['música', 'relajación', 'concentración'],
                    category: 'Música'
                }
            ];

            for (const videoData of sampleVideos) {
                const video = new Video(videoData);
                await video.save();
                console.log(`✅ Video creado: ${video.title}`);
            }
        } else {
            console.log('ℹ️ Ya existen videos en la base de datos');
        }

        // Crear índices para optimizar consultas
        console.log('📊 Creando índices...');
        await Video.collection.createIndex({ title: 'text', description: 'text' });
        await Video.collection.createIndex({ views: -1 });
        await Video.collection.createIndex({ uploadedAt: -1 });
        await Video.collection.createIndex({ uploader: 1 });
        console.log('✅ Índices creados');

        console.log('\n🎉 Configuración completada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('• Base de datos configurada');
        console.log('• Directorios creados');
        console.log('• Usuario administrador creado');
        console.log('• Videos de ejemplo agregados');
        console.log('• Índices de base de datos creados');

        console.log('\n🚀 Para iniciar el servidor:');
        console.log('• Desarrollo: npm run dev');
        console.log('• Producción: npm start');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Desconectado de MongoDB');
    }
}

// Función para limpiar la base de datos (usar con precaución)
async function cleanDatabase() {
    try {
        console.log('🧹 Limpiando base de datos...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zentube');

        await User.deleteMany({});
        await Video.deleteMany({});

        console.log('✅ Base de datos limpiada');

    } catch (error) {
        console.error('❌ Error al limpiar la base de datos:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Ejecutar setup
const command = process.argv[2];

if (command === 'clean') {
    cleanDatabase();
} else {
    setupDatabase();
}