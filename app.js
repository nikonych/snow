import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
    generateSnowflake,
    generateDragonFractal,
    generateLevyFractal,
    generateKochSnowflake,
    generateKochHexSnowflake,
    generateSnowflakeWithLayers,
} from './fractals.js';

// Сцена, камера, рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// Настройка минимального и максимального зума
controls.minDistance = 10; // Камера не сможет подойти ближе, чем 10
controls.maxDistance = 50; // Камера не сможет удалиться дальше, чем 50

// Установка камеры
camera.position.z = 30;

// Добавление света
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Фон с изображением
const textureLoader = new THREE.TextureLoader();
textureLoader.load('path_to_your_image.jpg', (texture) => {
    scene.background = texture;
});

// Переменные для фракталов
let iterations = 4; // Количество итераций фрактала
let layers = 5; // Количество слоёв для снежинок со слоями
let currentFractal = 'snowflake'; // Текущий выбранный фрактал

// Функция очистки сцены
function clearScene() {
    while (scene.children.length > 1) {
        scene.remove(scene.children[scene.children.length - 1]);
    }
}

// Функция обновления фрактала
function updateFractal() {
    clearScene();

    // Генерация выбранного фрактала
    switch (currentFractal) {
        case 'snowflake':
            generateSnowflake(scene, iterations);
            break;
        case 'koch':
            generateKochSnowflake(scene, iterations);
            break;
        case 'kochHex':
            generateKochHexSnowflake(scene, iterations, layers);
            break;
        case 'generateSnowflakeWithLayers':
            generateSnowflakeWithLayers(scene, iterations, layers);
            break;
        case 'dragon':
            generateDragonFractal(scene, iterations);
            break;
        case 'levy':
            generateLevyFractal(scene, iterations);
            break;
        default:
            console.error('Unknown fractal type:', currentFractal);
    }
}

// Обработчик изменения итераций
const slider = document.getElementById('slider');
slider.addEventListener('input', (event) => {
    iterations = parseInt(event.target.value, 10);
    updateFractal();
});

// Обработчик изменения количества слоёв
const slider1 = document.getElementById('layers');
slider1.addEventListener('input', (event) => {
    layers = parseInt(event.target.value, 10);
    updateFractal();
});

// Обработчик изменения выбранного фрактала
const fractalSelect = document.getElementById('fractalSelect');
fractalSelect.addEventListener('change', (event) => {
    currentFractal = event.target.value;
    updateFractal();
});

// Инициализация первого фрактала
updateFractal();

// Анимация
function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
