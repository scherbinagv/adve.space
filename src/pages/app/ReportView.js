import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Регистрация необходимых элементов для Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportView = ({ onClose }) => {
  // Замоканные данные отчета
  const reportData = {
    reportNumber: '20340120412401',
    date: '25.08.2024',
    location: 'Бухарест',
    area: '25000 м2',
    panels: 210,
    available: 30,
    uniqueAdvertisers: 83,
    topAdvertisers: [
      { name: 'Рекламодатель 1', percentage: 8.75 },
      { name: 'Рекламодатель 2', percentage: 7.56 },
      { name: 'Рекламодатель 3', percentage: 2.32 },
      { name: 'Другие', percentage: 68 },
    ],
    advertiserStats: {
      constructions: 154,
      unique: 1,
      occupiedArea: '7600 м2',
    },
    dataRelevance: [
      { range: 'До 5 дней', percentage: 94 },
      { range: 'До 15 дней', percentage: 5 },
      { range: 'Больше 15 дней', percentage: 1 },
    ],
  };

  // Данные для диаграммы
  const chartData = {
    labels: reportData.topAdvertisers.map((adv) => adv.name),
    datasets: [
      {
        label: 'Распределение рекламодателей',
        data: reportData.topAdvertisers.map((adv) => adv.percentage),
        backgroundColor: [
          '#FF6384', // Цвет для первого рекламодателя
          '#36A2EB', // Цвет для второго
          '#FFCE56', // Цвет для третьего
          '#B0BEC5', // Цвет для "Другие"
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Опции для диаграммы
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className='popup'>
        <div className='popup-container'>
            <div className='popup-content'>


            {/* <div className="report-view-overlay">
                <div className="report-view"> */}
                    <button className="close-button" onClick={onClose}>
                    ✕
                    </button>
                    <h2>Сводный отчет № {reportData.reportNumber}</h2>
                    <p>Область отчета: {reportData.location}</p>
                    <p>Дата: {reportData.date}</p>
                    <p>Площадь: {reportData.area}</p>
                    <p>Панелей: {reportData.panels}</p>
                    <p>Доступных: {reportData.available}</p>
                    <p>Уникальных рекламодателей: {reportData.uniqueAdvertisers}</p>

                    <div className="chart-container">
                    <Doughnut data={chartData} options={chartOptions} />
                    </div>

                    <h3>ТОП рекламодателей:</h3>
                    <ul>
                    {reportData.topAdvertisers.map((advertiser, index) => (
                        <li key={index}>
                        {advertiser.name} - {advertiser.percentage}%
                        </li>
                    ))}
                    </ul>

                    <h3>Статистика рекламодателей:</h3>
                    <p>Конструкций: {reportData.advertiserStats.constructions}</p>
                    <p>Уникальных: {reportData.advertiserStats.unique}</p>
                    <p>Занятая площадь: {reportData.advertiserStats.occupiedArea}</p>

                    <h3>Актуальность данных:</h3>
                    <ul>
                    {reportData.dataRelevance.map((relevance, index) => (
                        <li key={index}>
                        {relevance.range} - {relevance.percentage}%
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            {/* </div>
        </div> */}
    </div>

  );
};

export default ReportView;
