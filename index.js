// Сгенерируем случайные данные для кластеризации
const n_samples = 200;
const n_clusters = 3;
const randomPoints = Array.from({ length: n_samples }, () => [
  Math.random(),
  Math.random(),
]);

// Реализация алгоритма K-средних
function kmeans(points, k) {
  // Инициализация центроидов случайным образом
  const centroids = points
    .slice(0, k)
    .map((point) => [point[0], point[1]]);

  // Функция для вычисления расстояния между двумя точками
  function distance(point1, point2) {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Нахождение ближайшего центроида для каждой точки
  function assignClusters() {
    const clusters = Array.from({ length: points.length }, () => -1);
    for (let i = 0; i < points.length; i++) {
      let minDistance = Infinity;
      let clusterIndex = -1;
      for (let j = 0; j < centroids.length; j++) {
        const dist = distance(points[i], centroids[j]);
        if (dist < minDistance) {
          minDistance = dist;
          clusterIndex = j;
        }
      }
      clusters[i] = clusterIndex;
    }
    return clusters;
  }

  // Обновление положения центроидов
  function updateCentroids(clusters) {
    const newCentroids = Array.from({ length: centroids.length }, () => [
      0,
      0,
    ]);
    const counts = Array.from({ length: centroids.length }, () => 0);
    for (let i = 0; i < points.length; i++) {
      const clusterIndex = clusters[i];
      newCentroids[clusterIndex][0] += points[i][0];
      newCentroids[clusterIndex][1] += points[i][1];
      counts[clusterIndex]++;
    }
    for (let j = 0; j < centroids.length; j++) {
      newCentroids[j][0] /= counts[j];
      newCentroids[j][1] /= counts[j];
    }
    return newCentroids;
  }

  // Итеративное обновление центроидов и присваивание кластеров
  let prevCentroids = centroids;
  let currentCentroids = updateCentroids(Array.from({ length: points.length }, () => 0));
  while (
    JSON.stringify(prevCentroids) !== JSON.stringify(currentCentroids)
  ) {
    const clusters = assignClusters();
    prevCentroids = currentCentroids;
    currentCentroids = updateCentroids(clusters);
  }

  return assignClusters();
}

// Применяем алгоритм K-средних для кластеризации данных
const clusters = kmeans(randomPoints, n_clusters
