import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Генерация игольчатой снежинки
 * @param {THREE.Scene} scene - Сцена Three.js
 */
export function generateSpikySnowflake(scene) {
    // Очистка сцены от предыдущих объектов (оставляем только свет)
    while (scene.children.length > 1) {
        scene.remove(scene.children[scene.children.length - 1]);
    }

    // Параметры снежинки
    const mainRadius = 5; // Длина главных лучей
    const sideBranchLength = mainRadius * 0.4; // Длина боковых ветвей
    const levels = 3; // Количество уровней боковых ветвей
    const branches = 6; // Количество главных лучей
    const angleSpread = Math.PI / 6; // Угол отклонения боковых ветвей (30°)

    // Основной материал
    const material = new THREE.LineBasicMaterial({color: 0xffffff});

    // Функция для создания одного луча с боковыми ветвями
    function createBranch(start, direction, length) {
        const end = new THREE.Vector3().addVectors(
            start,
            direction.clone().multiplyScalar(length)
        );

        // Рисуем основной луч
        const mainGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const mainLine = new THREE.Line(mainGeometry, material);
        scene.add(mainLine);

        // Добавляем боковые ветви
        for (let i = 1; i <= levels; i++) {
            const offset = (length / (levels + 1)) * i; // Смещение по длине основного луча
            const basePoint = new THREE.Vector3().addVectors(
                start,
                direction.clone().multiplyScalar(offset)
            );

            // Левая боковая ветка
            const leftDirection = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), angleSpread);
            const leftEnd = new THREE.Vector3().addVectors(
                basePoint,
                leftDirection.clone().multiplyScalar(sideBranchLength)
            );
            const leftGeometry = new THREE.BufferGeometry().setFromPoints([basePoint, leftEnd]);
            const leftLine = new THREE.Line(leftGeometry, material);
            scene.add(leftLine);

            // Правая боковая ветка
            const rightDirection = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -angleSpread);
            const rightEnd = new THREE.Vector3().addVectors(
                basePoint,
                rightDirection.clone().multiplyScalar(sideBranchLength)
            );
            const rightGeometry = new THREE.BufferGeometry().setFromPoints([basePoint, rightEnd]);
            const rightLine = new THREE.Line(rightGeometry, material);
            scene.add(rightLine);
        }
    }

    // Генерация снежинки с 6 главными лучами
    for (let i = 0; i < branches; i++) {
        const angle = (i * 2 * Math.PI) / branches; // Угол для текущего луча
        const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0); // Направление луча
        createBranch(new THREE.Vector3(0, 0, 0), direction, mainRadius); // Создаем главный луч
    }
}

/**
 * Генерация шестиугольной снежинки
 * @param {THREE.Scene} scene - Сцена Three.js
 */
export function generateHexSnowflake(scene) {
    // Очистка сцены от предыдущих объектов
    while (scene.children.length > 1) {
        scene.remove(scene.children[scene.children.length - 1]);
    }

    // Параметры снежинки
    const hexRadius = 2; // Радиус одного шестиугольника
    const mainRadius = 5; // Расстояние от центра до центров шестиугольников
    const branches = 6; // Количество шестиугольников вокруг центра
    const stickWidth = 0.2; // Ширина прямоугольника
    const stickHeight = 0.5; // Толщина прямоугольника

    // Материал для стеклянной снежинки
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87ceeb, // Светло-голубой цвет
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    // Функция для создания шестиугольника
    function createHexagon(center, radius) {
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            hexPoints.push(new THREE.Vector3(x, y, 0));
        }
        hexPoints.push(hexPoints[0]); // Замыкаем шестиугольник

        for (let i = 0; i < hexPoints.length - 1; i++) {
            createStick(hexPoints[i], hexPoints[i + 1]);
        }

        return hexPoints; // Возвращаем точки шестиугольника
    }

    // Функция для создания палочки (прямоугольника) между двумя точками
    function createStick(start, end) {
        const distance = start.distanceTo(end);

        // Создаем геометрию прямоугольника
        const boxGeometry = new THREE.BoxGeometry(distance, stickHeight, stickWidth);

        // Находим середину между точками
        const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        // Создаем прямоугольник
        const stick = new THREE.Mesh(boxGeometry, glassMaterial);

        // Поворачиваем прямоугольник в направлении от start к end
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const axis = new THREE.Vector3(1, 0, 0); // Ось X — это базовое направление прямоугольника
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
        stick.setRotationFromQuaternion(quaternion);

        // Устанавливаем позицию прямоугольника
        stick.position.copy(position);

        scene.add(stick);
    }

    // Центральный круг
    const centralCircleGeometry = new THREE.CircleGeometry(0.8, 32);
    const centralCircle = new THREE.Mesh(centralCircleGeometry, glassMaterial);
    scene.add(centralCircle);

    // Центральный шестиугольник
    const centralHexagonPoints = createHexagon(new THREE.Vector3(0, 0, 0), hexRadius);

    // Массив для хранения центров внешних шестиугольников
    const externalCenters = [];

    // Внешние шестиугольники
    for (let i = 0; i < branches; i++) {
        const angle = (i * 2 * Math.PI) / branches;
        const x = mainRadius * Math.cos(angle);
        const y = mainRadius * Math.sin(angle);
        const externalCenter = new THREE.Vector3(x, y, 0);
        createHexagon(externalCenter, hexRadius);
        externalCenters.push(externalCenter);

        // Соединяем центральный шестиугольник с внешними
        createStick(new THREE.Vector3(0, 0, 0), externalCenter);
    }

    // Соединение внешних шестиугольников между собой
    for (let i = 0; i < externalCenters.length; i++) {
        const start = externalCenters[i];
        const end = externalCenters[(i + 1) % externalCenters.length]; // Замыкаем круг
        createStick(start, end);
    }
}


export function generateFractalSnowflake(scene, iterations = 3) {
    // Очистка сцены от предыдущих объектов
    while (scene.children.length > 1) {
        scene.remove(scene.children[scene.children.length - 1]);
    }

    // Материал для снежинки
    const material = new THREE.LineBasicMaterial({color: 0x87ceeb});

    // Функция для создания точки
    function createVector(x, y) {
        return new THREE.Vector3(x, y, 0);
    }

    // Функция для разделения стороны и добавления новых точек с рандомным "пиком"
    function divideEdge(start, end) {
        const points = [];

        // Вычисляем промежуточные точки
        const oneThird = start.clone().lerp(end, 1 / 3); // Первая треть
        const twoThird = start.clone().lerp(end, 2 / 3); // Вторая треть

        // Находим вершину маленького треугольника
        const direction = twoThird.clone().sub(oneThird).normalize();
        const midPoint = oneThird.clone().add(twoThird).divideScalar(2); // Середина между oneThird и twoThird

        // Генерация рандомного смещения для "пика"
        const randomHeightFactor = 0.5 + Math.random(); // Коэффициент высоты от 0.5 до 1.5
        const height = direction
            .clone()
            .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3) // Угол 60°
            .multiplyScalar(oneThird.distanceTo(twoThird) * randomHeightFactor);
        const peak = midPoint.clone().add(height); // Пик треугольника

        // Добавляем точки: начало, первая треть, пик, вторая треть, конец
        points.push(start);
        points.push(oneThird);
        points.push(peak);
        points.push(twoThird);
        points.push(end);

        return points;
    }

    // Рекурсивная функция для создания фрактальных сторон
    function createFractal(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            newPoints.push(...divideEdge(start, end).slice(0, -1)); // Убираем последнюю точку, чтобы избежать дублирования
        }
        newPoints.push(points[points.length - 1]); // Добавляем последнюю точку

        return createFractal(newPoints, depth - 1);
    }

    // Создаем начальный шестиугольник
    const radius = 5; // Радиус шестиугольника
    const initialPoints = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6; // Углы 0, 60, 120, ..., 300 градусов
        initialPoints.push(createVector(radius * Math.cos(angle), radius * Math.sin(angle)));
    }
    initialPoints.push(initialPoints[0]); // Замыкаем шестиугольник

    // Генерируем фрактальную снежинку
    const fractalPoints = createFractal(initialPoints, iterations);

    // Создаем геометрию линии
    const geometry = new THREE.BufferGeometry().setFromPoints(fractalPoints);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}


// export function generateSnowflake(scene, iterations = 3) {
//     // Очистка сцены от предыдущих объектов
//     while (scene.children.length > 1) {
//         scene.remove(scene.children[scene.children.length - 1]);
//     }
//
//     // Материал для снежинки
//     const material = new THREE.LineBasicMaterial({ color: 0xffffff });
//
//     // Функция для создания точки
//     function createVector(x, y) {
//         return new THREE.Vector3(x, y, 0);
//     }
//
//     // Функция для разделения стороны и добавления новых точек для фрактала Коха
//     function divideEdge(start, end) {
//         const points = [];
//
//         // Вычисляем промежуточные точки
//         const oneThird = start.clone().lerp(end, 1 / 3); // Первая треть
//         const twoThird = start.clone().lerp(end, 2 / 3); // Вторая треть
//
//         // Вычисляем вершину маленького треугольника с рандомным смещением
//         const direction = twoThird.clone().sub(oneThird).normalize();
//         const midPoint = oneThird.clone().add(twoThird).divideScalar(2); // Середина между oneThird и twoThird
//
//         const randomFactor = 0.8 + Math.random() * 0.4; // Фактор для рандомной высоты
//         const height = direction
//             .clone()
//             .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3) // Угол 60°
//             .multiplyScalar(oneThird.distanceTo(twoThird) * randomFactor);
//         const peak = midPoint.clone().add(height); // Пик треугольника
//
//         // Добавляем точки: начало, первая треть, пик, вторая треть, конец
//         points.push(start);
//         points.push(oneThird);
//         points.push(peak);
//         points.push(twoThird);
//         points.push(end);
//
//         return points;
//     }
//
//     // Рекурсивная функция для создания фрактальных сторон
//     function createFractal(points, depth) {
//         if (depth === 0) return points;
//
//         const newPoints = [];
//         for (let i = 0; i < points.length - 1; i++) {
//             const start = points[i];
//             const end = points[i + 1];
//             newPoints.push(...divideEdge(start, end).slice(0, -1)); // Убираем последнюю точку, чтобы избежать дублирования
//         }
//         newPoints.push(points[points.length - 1]); // Добавляем последнюю точку
//
//         return createFractal(newPoints, depth - 1);
//     }
//
//     // Создаем одну ветвь снежинки
//     const radius = 5; // Длина ветви
//     const initialPoints = [
//         createVector(0, 0), // Начало
//         createVector(0, radius), // Конец
//     ];
//
//     // Генерируем одну ветвь снежинки
//     const branchPoints = createFractal(initialPoints, iterations);
//
//     // Создаем шесть ветвей с поворотами
//     for (let i = 0; i < 10; i++) {
//         const angle = (i * 2 * Math.PI) / 10; // Угол поворота
//         const rotatedPoints = branchPoints.map((point) => {
//             const rotatedX = point.x * Math.cos(angle) - point.y * Math.sin(angle);
//             const rotatedY = point.x * Math.sin(angle) + point.y * Math.cos(angle);
//             return createVector(rotatedX, rotatedY);
//         });
//
//         // Создаем геометрию линии для каждой ветви
//         const geometry = new THREE.BufferGeometry().setFromPoints(rotatedPoints);
//         const line = new THREE.Line(geometry, material);
//         scene.add(line);
//     }
// }


// export function generateSnowflake(scene, iterations = 4) {
//     // Очистка сцены от предыдущих объектов
//     while (scene.children.length > 1) {
//         scene.remove(scene.children[scene.children.length - 1]);
//     }
//
//     // Материал для стеклянной снежинки
//     const glassMaterial = new THREE.MeshPhysicalMaterial({
//         color: 0x87ceeb, // Светло-голубой оттенок
//         transparent: true,
//         opacity: 0.6,
//         roughness: 0.1,
//         metalness: 0.5,
//         clearcoat: 1.0,
//         clearcoatRoughness: 0.1,
//     });
//
//     // Функция для создания точки
//     function createVector(x, y) {
//         return new THREE.Vector3(x, y, 0);
//     }
//
//     // Функция для создания палочек (прямоугольников) между точками
//     function createStickGeometry(start, end) {
//         const distance = start.distanceTo(end);
//
//         // Геометрия для тонкого прямоугольника
//         const boxGeometry = new THREE.BoxGeometry(distance, 0.1, 0.1);
//
//         // Находим середину между точками
//         const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
//
//         // Поворачиваем палочку в направлении от start к end
//         const direction = new THREE.Vector3().subVectors(end, start).normalize();
//         const axis = new THREE.Vector3(1, 0, 0); // Ось X — это базовое направление прямоугольника
//         const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
//
//         // Применяем трансформации к геометрии
//         boxGeometry.applyQuaternion(quaternion);
//         boxGeometry.translate(position.x, position.y, position.z);
//
//         // Возвращаем геометрию
//         return boxGeometry;
//     }
//
//
//     // Создаем одну ветвь снежинки
//     const radius = 5; // Длина ветви
//     const initialPoints = [createVector(0, 0), createVector(0, radius)];
//
//     // Создаем фрактал
//     function createFractal(points, depth) {
//         if (depth === 0) return points;
//
//         const newPoints = [];
//         for (let i = 0; i < points.length - 1; i++) {
//             const start = points[i];
//             const end = points[i + 1];
//             const oneThird = start.clone().lerp(end, 1 / 3);
//             const twoThird = start.clone().lerp(end, 2 / 3);
//
//             const direction = twoThird.clone().sub(oneThird).normalize();
//             const height = direction
//                 .clone()
//                 .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3) // Угол 60°
//                 .multiplyScalar(oneThird.distanceTo(twoThird));
//             const peak = oneThird.clone().add(height);
//
//             newPoints.push(start, oneThird, peak, twoThird);
//         }
//         newPoints.push(points[points.length - 1]);
//
//         return createFractal(newPoints, depth - 1);
//     }
//
//     const geometries = [];
//
// // Генерируем ветви снежинки
//     for (let i = 0; i < 6; i++) {
//         const angle = (i * 2 * Math.PI) / 6; // Угол поворота
//         const rotatedPoints = initialPoints.map((point) => {
//             const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
//             const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
//             return createVector(x, y);
//         });
//
//         const fractalPoints = createFractal(rotatedPoints, iterations);
//
//         // Создаем палочки для текущей ветви
//         for (let j = 0; j < fractalPoints.length - 1; j++) {
//             const geometry = createStickGeometry(fractalPoints[j], fractalPoints[j + 1]);
//             geometries.push(geometry);
//         }
//     }
//
// // Объединяем все геометрии
//     const mergedGeometry = mergeGeometries(geometries, false); // Объединение без групп
//     const snowflake = new THREE.Mesh(mergedGeometry, glassMaterial);
//
// // Добавляем снежинку в сцену
//     scene.add(snowflake);
//
// }



export function generateSnowflake(scene, iterations = 4) {
    // Очистка сцены от предыдущих объектов
    while (scene.children.length > 1) {
        scene.remove(scene.children[scene.children.length - 1]);
    }

    // Материал для линий снежинки
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Функция для создания точки
    function createVector(x, y) {
        return new THREE.Vector3(x, y, 0);
    }

    // Функция для рекурсивного создания фрактальных сторон
    function createFractal(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            const oneThird = start.clone().lerp(end, 1 / 3);
            const twoThird = start.clone().lerp(end, 2 / 3);

            const direction = twoThird.clone().sub(oneThird).normalize();
            const height = direction
                .clone()
                .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3) // Угол 60°
                .multiplyScalar(oneThird.distanceTo(twoThird));
            const peak = oneThird.clone().add(height);

            newPoints.push(start, oneThird, peak, twoThird);
        }
        newPoints.push(points[points.length - 1]);

        return createFractal(newPoints, depth - 1);
    }

    // Создаём фрактал для одной ветви
    const radius = 5; // Длина ветви
    const initialPoints = [createVector(0, 0), createVector(0, radius)];
    const branchPoints = createFractal(initialPoints, iterations);

    // Линии для всей снежинки
    const vertices = [];

    // Создаем шесть ветвей с поворотами
    for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6; // Угол поворота
        const rotatedPoints = branchPoints.map((point) => {
            const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
            const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
            return createVector(x, y);
        });

        for (let j = 0; j < rotatedPoints.length - 1; j++) {
            vertices.push(rotatedPoints[j], rotatedPoints[j + 1]);
        }
    }

    // Создаём BufferGeometry для линий
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const line = new THREE.LineSegments(geometry, lineMaterial);
    scene.add(line);
}

