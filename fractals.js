import * as THREE from 'three';

// Фрактал: Снежинка
export function generateSnowflake(scene, iterations = 4) {
    // Реализация снежинки (см. предыдущие примеры)
}

// Фрактал: Кривая дракона
export function generateDragonFractal(scene, iterations = 4) {
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)];

    function subdivide(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            mid.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4); // 45° поворот

            newPoints.push(start, mid);
        }
        newPoints.push(points[points.length - 1]);
        return subdivide(newPoints, depth - 1);
    }

    const fractalPoints = subdivide(points, iterations);
    const geometry = new THREE.BufferGeometry().setFromPoints(fractalPoints);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

// Фрактал: Кривая Леви
export function generateLevyFractal(scene, iterations = 4) {
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const points = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)];

    function subdivide(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            mid.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4); // 45° поворот

            newPoints.push(start, mid, end);
        }
        return subdivide(newPoints, depth - 1);
    }

    const fractalPoints = subdivide(points, iterations);
    const geometry = new THREE.BufferGeometry().setFromPoints(fractalPoints);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}


// Фрактал: Снежинка Коха
export function generateKochSnowflake(scene, iterations = 4) {
    const material = new THREE.LineBasicMaterial({ color: 0x87ceeb });

    // Функция для создания точки
    function createVector(x, y) {
        return new THREE.Vector3(x, y, 0);
    }

    // Функция для рекурсивного разделения стороны
    function subdivide(start, end, depth) {
        if (depth === 0) return [start, end];

        const oneThird = start.clone().lerp(end, 1 / 3);
        const twoThird = start.clone().lerp(end, 2 / 3);

        const direction = twoThird.clone().sub(oneThird).normalize();
        const height = direction
            .clone()
            .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3) // Угол 60°
            .multiplyScalar(oneThird.distanceTo(twoThird));
        const peak = oneThird.clone().add(height);

        return [
            start,
            oneThird,
            peak,
            twoThird,
            end,
        ];
    }

    // Функция для построения фрактала
    function createFractal(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            newPoints.push(...subdivide(start, end, depth).slice(0, -1));
        }
        newPoints.push(points[points.length - 1]); // Добавляем последнюю точку

        return createFractal(newPoints, depth - 1);
    }

    // Создаем треугольник для основы снежинки
    const radius = 5;
    const points = [
        createVector(0, radius),
        createVector(-radius * Math.sin(Math.PI / 3), -radius / 2),
        createVector(radius * Math.sin(Math.PI / 3), -radius / 2),
        createVector(0, radius),
    ];

    // Генерируем фрактал
    const fractalPoints = createFractal(points, iterations);

    // Создаем геометрию
    const geometry = new THREE.BufferGeometry().setFromPoints(fractalPoints);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}


// Фрактал: Снежинка Коха (Шестиугольная)
// Фрактал: Снежинка Коха (Шестиугольная) с внутренностями
// Фрактал: Снежинка Коха (Шестиугольная) с отклонениями на одной стороне
// export function generateKochHexSnowflake(scene, iterations = 4, layers = 3) {
//     const material = new THREE.LineBasicMaterial({ color: 0x87ceeb });
//
//     // Функция для создания точки
//     function createVector(x, y) {
//         return new THREE.Vector3(x, y, 0);
//     }
//
//     // Функция для генерации случайного отклонения
//     function randomize(value, deviation) {
//         return value + (Math.random() * 2 - 1) * deviation; // Значение ± отклонение
//     }
//
//     // Функция для рекурсивного разделения стороны с рандомизацией
//     function subdivide(start, end, depth) {
//         if (depth === 0) return [start, end];
//
//         const oneThird = start.clone().lerp(end, randomize(1 / 3, 0.05)); // Рандомизация длины
//         const twoThird = start.clone().lerp(end, randomize(2 / 3, 0.05)); // Рандомизация длины
//
//         const direction = twoThird.clone().sub(oneThird).normalize();
//         const height = direction
//             .clone()
//             .applyAxisAngle(
//                 new THREE.Vector3(0, 0, 1),
//                 randomize(Math.PI / 3, Math.PI / 30) // Рандомизация угла
//             )
//             .multiplyScalar(oneThird.distanceTo(twoThird));
//         const peak = oneThird.clone().add(height);
//
//         return [start, oneThird, peak, twoThird, end];
//     }
//
//     // Функция для построения фрактала с рандомизацией
//     function createFractal(points, depth) {
//         if (depth === 0) return points;
//
//         const newPoints = [];
//         for (let i = 0; i < points.length - 1; i++) {
//             const start = points[i];
//             const end = points[i + 1];
//             newPoints.push(...subdivide(start, end, depth).slice(0, -1));
//         }
//         newPoints.push(points[points.length - 1]); // Добавляем последнюю точку
//
//         return createFractal(newPoints, depth - 1);
//     }
//
//     // Функция для дублирования одной стороны на все шесть сторон
//     function duplicateSide(points, center, radius) {
//         const geometries = [];
//         for (let i = 0; i < 6; i++) {
//             const angle = (i * 2 * Math.PI) / 6;
//             const rotatedPoints = points.map((point) => {
//                 const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
//                 const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
//                 return createVector(x + center.x, y + center.y);
//             });
//             geometries.push(...rotatedPoints);
//         }
//         return geometries;
//     }
//
//     // Создаём одну сторону шестиугольника
//     const radius = 5; // Радиус внешнего шестиугольника
//     const start = createVector(0, radius);
//     const end = createVector(radius * Math.sin(Math.PI / 3), -radius / 2);
//     const fractalSide = createFractal([start, end], iterations);
//
//     // Дублируем сторону на все шесть сторон
//     const fullSnowflakePoints = duplicateSide(fractalSide, new THREE.Vector3(0, 0, 0), radius);
//
//     // Создаём геометрию снежинки
//     const geometry = new THREE.BufferGeometry().setFromPoints(fullSnowflakePoints);
//     const line = new THREE.LineSegments(geometry, material);
//     scene.add(line);
//
//     // Добавляем внутренние слои (опционально)
//     for (let i = 1; i <= layers; i++) {
//         const innerRadius = radius * (1 - i * 0.2); // Уменьшаем радиус для внутренних слоёв
//         const innerStart = createVector(0, innerRadius);
//         const innerEnd = createVector(innerRadius * Math.sin(Math.PI / 3), -innerRadius / 2);
//         const innerFractalSide = createFractal([innerStart, innerEnd], iterations);
//
//         const innerPoints = duplicateSide(innerFractalSide, new THREE.Vector3(0, 0, 0), innerRadius);
//         const innerGeometry = new THREE.BufferGeometry().setFromPoints(innerPoints);
//         const innerLine = new THREE.LineSegments(innerGeometry, material);
//         scene.add(innerLine);
//     }
// }


export function generateKochHexSnowflake(scene, iterations = 4, layers = 3) {
    const material = new THREE.LineBasicMaterial({ color: 0x87ceeb });

    // Функция для создания точки
    function createVector(x, y) {
        return new THREE.Vector3(x, y, 0);
    }

    // Функция для генерации случайного отклонения
    function randomize(value, deviation) {
        return value + (Math.random() * 2 - 1) * deviation; // Значение ± отклонение
    }

    // Функция для рекурсивного разделения стороны с рандомизацией
    function subdivide(start, end, depth) {
        if (depth === 0) return [start, end];

        const oneThird = start.clone().lerp(end, randomize(1 / 3, 0.05)); // Рандомизация длины
        const twoThird = start.clone().lerp(end, randomize(2 / 3, 0.05)); // Рандомизация длины

        const direction = twoThird.clone().sub(oneThird).normalize();
        const height = direction
            .clone()
            .applyAxisAngle(
                new THREE.Vector3(0, 0, 1),
                randomize(Math.PI / 3, Math.PI / 30) // Рандомизация угла
            )
            .multiplyScalar(oneThird.distanceTo(twoThird));
        const peak = oneThird.clone().add(height);

        return [start, oneThird, peak, twoThird, end];
    }

    // Функция для построения фрактала с рандомизацией
    function createFractal(points, depth) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            newPoints.push(...subdivide(start, end, depth).slice(0, -1));
        }
        newPoints.push(points[points.length - 1]); // Добавляем последнюю точку

        return createFractal(newPoints, depth - 1);
    }

    // Функция для дублирования одной стороны на все шесть сторон
    function duplicateSide(points, center, radius) {
        const geometries = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const rotatedPoints = points.map((point) => {
                const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
                const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
                return createVector(x + center.x, y + center.y);
            });
            geometries.push(...rotatedPoints);
        }
        return geometries;
    }

    // Создаём одну сторону шестиугольника
    const radius = 10; // Увеличиваем радиус снежинки
    const start = createVector(0, radius);
    const end = createVector(radius * Math.sin(Math.PI / 3), -radius / 2);
    const fractalSide = createFractal([start, end], iterations);

    // Дублируем сторону на все шесть сторон
    const fullSnowflakePoints = duplicateSide(fractalSide, new THREE.Vector3(0, 0, 0), radius);

    // Создаём геометрию снежинки
    const geometry = new THREE.BufferGeometry().setFromPoints(fullSnowflakePoints);
    const line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    // Добавляем внутренние слои (опционально)
    for (let i = 1; i <= layers; i++) {
        const innerRadius = radius * (1 - i * 0.2); // Уменьшаем радиус для внутренних слоёв
        const innerStart = createVector(0, innerRadius);
        const innerEnd = createVector(innerRadius * Math.sin(Math.PI / 3), -innerRadius / 2);
        const innerFractalSide = createFractal([innerStart, innerEnd], iterations);

        const innerPoints = duplicateSide(innerFractalSide, new THREE.Vector3(0, 0, 0), innerRadius);
        const innerGeometry = new THREE.BufferGeometry().setFromPoints(innerPoints);
        const innerLine = new THREE.LineSegments(innerGeometry, material);
        scene.add(innerLine);
    }
}

// export function generateKochHexSnowflake(scene, iterations = 4, layers = 3) {
//     const material = new THREE.LineBasicMaterial({ color: 0x87ceeb });
//
//     // Функция для создания точки
//     function createVector(x, y) {
//         return new THREE.Vector3(x, y, 0);
//     }
//
//     // Функция для генерации случайного отклонения
//     function randomize(value, deviation) {
//         return value + (Math.random() * 2 - 1) * deviation; // Значение ± отклонение
//     }
//
//     // Функция для рекурсивного разделения стороны с рандомизацией
//     function subdivide(start, end, depth) {
//         if (depth === 0) return [start, end];
//
//         const oneThird = start.clone().lerp(end, randomize(1 / 3, 0.05)); // Рандомизация длины
//         const twoThird = start.clone().lerp(end, randomize(2 / 3, 0.05)); // Рандомизация длины
//
//         const direction = twoThird.clone().sub(oneThird).normalize();
//         const height = direction
//             .clone()
//             .applyAxisAngle(
//                 new THREE.Vector3(0, 0, 1),
//                 randomize(Math.PI / 3, Math.PI / 30) // Рандомизация угла
//             )
//             .multiplyScalar(oneThird.distanceTo(twoThird));
//         const peak = oneThird.clone().add(height);
//
//         return [start, oneThird, peak, twoThird, end];
//     }
//
//     // Функция для построения фрактала с рандомизацией
//     function createFractal(points, depth) {
//         if (depth === 0) return points;
//
//         const newPoints = [];
//         for (let i = 0; i < points.length - 1; i++) {
//             const start = points[i];
//             const end = points[i + 1];
//             newPoints.push(...subdivide(start, end, depth).slice(0, -1));
//         }
//         newPoints.push(points[points.length - 1]); // Добавляем последнюю точку
//
//         return createFractal(newPoints, depth - 1);
//     }
//
//     // Функция для дублирования одной стороны на все шесть сторон
//     function duplicateSide(points, center, radius) {
//         const geometries = [];
//         for (let i = 0; i < 6; i++) {
//             const angle = (i * 2 * Math.PI) / 6;
//             const rotatedPoints = points.map((point) => {
//                 const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
//                 const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
//                 return createVector(x + center.x, y + center.y);
//             });
//             geometries.push(...rotatedPoints);
//         }
//         return geometries;
//     }
//
//     // Создаём одну сторону шестиугольника
//     const baseRadius = 10; // Базовый радиус снежинки
//     const start = createVector(0, baseRadius);
//     const end = createVector(baseRadius * Math.sin(Math.PI / 3), -baseRadius / 2);
//     const fractalSide = createFractal([start, end], iterations);
//
//     // Дублируем сторону на все шесть сторон
//     const fullSnowflakePoints = duplicateSide(fractalSide, new THREE.Vector3(0, 0, 0), baseRadius);
//
//     // Создаём геометрию снежинки
//     const geometry = new THREE.BufferGeometry().setFromPoints(fullSnowflakePoints);
//     const line = new THREE.LineSegments(geometry, material);
//     scene.add(line);
//
//     // Добавляем внешние слои
//     for (let i = 1; i <= layers; i++) {
//         const outerRadius = baseRadius + i * 2; // Увеличиваем радиус на каждом слое
//         const outerStart = createVector(0, outerRadius);
//         const outerEnd = createVector(outerRadius * Math.sin(Math.PI / 3), -outerRadius / 2);
//         const outerFractalSide = createFractal([outerStart, outerEnd], iterations);
//
//         const outerPoints = duplicateSide(outerFractalSide, new THREE.Vector3(0, 0, 0), outerRadius);
//         const outerGeometry = new THREE.BufferGeometry().setFromPoints(outerPoints);
//         const outerLine = new THREE.LineSegments(outerGeometry, material);
//         scene.add(outerLine);
//     }
// }


export function generateSnowflakeWithLayers(scene, iterations = 4, maxLayers = 6) {
    const material = new THREE.LineBasicMaterial({ color: 0x87ceeb }); // Цвет снежинки

    // Функция для создания точки
    function createVector(x, y) {
        return new THREE.Vector3(x, y, 0);
    }

    // Функция для рекурсивного построения фрактала с уникальным отклонением
    function subdivide(start, end, depth, deviation) {
        if (depth === 0) return [start, end];

        const oneThird = start.clone().lerp(end, 1 / 3);
        const twoThird = start.clone().lerp(end, 2 / 3);

        const direction = twoThird.clone().sub(oneThird).normalize();
        const height = direction
            .clone()
            .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3)
            .multiplyScalar(oneThird.distanceTo(twoThird) * deviation);
        const peak = oneThird.clone().add(height);

        return [start, oneThird, peak, twoThird, end];
    }

    // Функция для построения фрактала
    function createFractal(points, depth, deviation) {
        if (depth === 0) return points;

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            newPoints.push(...subdivide(start, end, depth, deviation).slice(0, -1));
        }
        newPoints.push(points[points.length - 1]); // Последняя точка

        return createFractal(newPoints, depth - 1, deviation);
    }

    // Функция для дублирования одной стороны на все шесть сторон
    function duplicateSide(points, center) {
        const geometries = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            const rotatedPoints = points.map((point) => {
                const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
                const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
                return createVector(x + center.x, y + center.y);
            });
            geometries.push(...rotatedPoints);
        }
        return geometries;
    }

    // Очистка сцены
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Генерация снежинки слоями
    const baseRadius = 3; // Радиус первого слоя
    for (let i = 0; i < maxLayers; i++) {
        const layerRadius = baseRadius + i * 2; // Увеличение радиуса для каждого слоя
        const layerDeviation = 0.5 + Math.random() * 0.5; // Уникальное отклонение для слоя

        const start = createVector(0, layerRadius);
        const end = createVector(layerRadius * Math.sin(Math.PI / 3), -layerRadius / 2);

        const fractalSide = createFractal([start, end], iterations, layerDeviation);

        const fullSnowflakePoints = duplicateSide(
            fractalSide,
            new THREE.Vector3(0, 0, 0)
        );

        const geometry = new THREE.BufferGeometry().setFromPoints(fullSnowflakePoints);
        const line = new THREE.LineSegments(geometry, material);
        scene.add(line);
    }
}
