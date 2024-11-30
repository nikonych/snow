import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Импортируем OrbitControls

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавляем OrbitControls для управления камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Параметры куста
const baseRadius = 3; // Радиус, откуда начинают расти ветки
const branchLength = 5; // Базовая длина ветки
const branchingFactor = 15; // Количество ветвей
const depth = 4; // Максимальная глубина веток
const angleSpread = Math.PI / 2; // Разброс углов веток
const slices = 6; // Количество кустов

// Параметры для кустов
let bushStructure = [];

/**
 * Функция для рисования ветвей куста и сохранения их структуры
 * @param {THREE.Vector3} start - Начальная точка ветки
 * @param {THREE.Vector3} direction - Направление ветки
 * @param {Number} length - Длина ветки
 * @param {Number} depth - Глубина ветки
 * @param {Boolean} saveStructure - Сохранять ли структуру ветки
 */
function drawBranch(start, direction, length, depth, saveStructure = false) {
    if (depth === 0) return;

    // Конечная точка ветки
    const end = new THREE.Vector3().addVectors(
        start,
        direction.clone().multiplyScalar(length)
    );

    // Рисуем линию
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Сохраняем структуру ветки, если нужно
    if (saveStructure) {
        bushStructure.push({ start, end });
    }

    // Рисуем дочерние ветки
    for (let i = 0; i < branchingFactor; i++) {
        const angleXZ = angleSpread * (Math.random() - 0.5); // Разброс угла в плоскости XZ
        const angleY = angleSpread * (Math.random() - 0.5); // Разброс вверх и вниз

        const rotationAxisXZ = new THREE.Vector3(0, 1, 0); // Вращение в плоскости XZ
        const rotationAxisY = new THREE.Vector3(1, 0, 0); // Вращение вверх/вниз

        const newDirection = direction
            .clone()
            .applyAxisAngle(rotationAxisXZ, angleXZ)
            .applyAxisAngle(rotationAxisY, angleY);

        drawBranch(
            end,
            newDirection,
            length * (0.6 + Math.random() * 0.3), // Длина веток уменьшается с глубиной
            depth - 1,
            saveStructure
        );
    }
}

/**
 * Создает куст на основе сохраненной структуры
 * @param {THREE.Vector3} offset - Смещение куста
 */
function drawBushFromStructure(offset) {
    bushStructure.forEach((branch) => {
        const start = branch.start.clone().add(offset);
        const end = branch.end.clone().add(offset);

        // Рисуем ветку
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    });
}

/**
 * Функция для размещения кустов вокруг центра
 * @param {Number} slices - Количество кустов
 */
function drawBushesFromCenter(slices) {
    const sliceAngle = (2 * Math.PI) / slices; // Угол между кустами

    for (let i = 0; i < slices; i++) {
        const angle = i * sliceAngle;
        const offset = new THREE.Vector3(
            Math.cos(angle) * baseRadius * 4, // Расстояние от центра
            Math.sin(angle) * baseRadius * 4,
            0
        );

        drawBushFromStructure(offset);
    }
}

// Создаем структуру одного куста
const initialDirection = new THREE.Vector3(0, 1, 0); // Направление "вверх"
drawBranch(new THREE.Vector3(0, 0, 0), initialDirection, branchLength, depth, true);

// Рисуем одинаковые кусты вокруг центра
drawBushesFromCenter(slices);

camera.position.z = 30; // Камера отдалена для полного обзора

// Рендер сцены
function render() {
    controls.update(); // Обновляем контроллер
    renderer.render(scene, camera); // Рендерим сцену
    requestAnimationFrame(render); // Запускаем цикл рендера
}
render();
