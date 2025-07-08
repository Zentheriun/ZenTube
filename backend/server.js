// server.js - Servidor principal de ZenTube
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests por IP
});
app.use('/api/', limiter);

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Configuración de multer para subir videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'video' ? 'uploads/videos' : 'uploads/thumbnails';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB para videos
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'video') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos de video'));
            }
        } else if (file.fieldname === 'thumbnail') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos de imagen para thumbnails'));
            }
        }
    }
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zentube', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Esquemas de la base de datos
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

const commentSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Modelos
const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'zentube_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// RUTAS DE AUTENTICACIÓN
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'El usuario o email ya existe'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generar token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'zentube_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'zentube_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
});

// RUTAS DE VIDEOS
app.get('/api/videos', async (req, res) => {
    try {
        const { page = 1, limit = 20, search, category, sortBy = 'uploadedAt' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sortBy]: -1 },
            populate: {
                path: 'uploader',
                select: 'username avatar'
            }
        };

        let query = { isPublic: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const videos = await Video.paginate(query, options);

        res.json({
            videos: videos.docs,
            totalPages: videos.totalPages,
            currentPage: videos.page,
            totalVideos: videos.totalDocs
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener videos' });
    }
});

app.get('/api/videos/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('uploader', 'username avatar subscribers');

        if (!video) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        // Incrementar views
        video.views += 1;
        await video.save();

        res.json(video);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener video' });
    }
});

app.post('/api/videos', authenticateToken, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, tags, category } = req.body;

        if (!req.files.video || !req.files.thumbnail) {
            return res.status(400).json({
                error: 'Video y thumbnail son requeridos'
            });
        }

        const video = new Video({
            title,
            description,
            filename: req.files.video[0].filename,
            thumbnail: req.files.thumbnail[0].filename,
            uploader: req.user.userId,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category: category || 'General'
        });

        await video.save();

        res.status(201).json({
            message: 'Video subido exitosamente',
            video
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir video' });
    }
});

// RUTAS DE COMENTARIOS
app.get('/api/videos/:id/comments', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find({ videoId: req.params.id })
            .populate('userId', 'username avatar')
            .populate('replies.userId', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
});

app.post('/api/videos/:id/comments', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;

        const comment = new Comment({
            videoId: req.params.id,
            userId: req.user.userId,
            text
        });

        await comment.save();
        await comment.populate('userId', 'username avatar');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear comentario' });
    }
});

// RUTAS DE PLAYLISTS
app.get('/api/playlists', authenticateToken, async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.user.userId })
            .populate('videos', 'title thumbnail duration');

        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener playlists' });
    }
});

app.post('/api/playlists', authenticateToken, async (req, res) => {
    try {
        const { name, description, isPublic } = req.body;

        const playlist = new Playlist({
            name,
            description,
            userId: req.user.userId,
            isPublic: isPublic !== undefined ? isPublic : true
        });

        await playlist.save();

        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear playlist' });
    }
});

// RUTAS DE USUARIOS
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -email');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const videos = await Video.find({ uploader: req.params.id, isPublic: true })
            .select('title thumbnail views uploadedAt')
            .sort({ uploadedAt: -1 });

        res.json({
            user,
            videos
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// RUTA DE TRENDING
app.get('/api/trending', async (req, res) => {
    try {
        const videos = await Video.find({ isPublic: true })
            .populate('uploader', 'username avatar')
            .sort({ views: -1, uploadedAt: -1 })
            .limit(50);

        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener videos trending' });
    }
});

// RUTA DE HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ZenTube ejecutándose en puerto ${PORT}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
});

module.exports = app;