(function(){
    "use strict";
  
    let currentWater = 0;
    let dailyGoal = 2500;
  
    // DOM элементы
    const waterFill = document.getElementById('waterFill');
    const currentMlDisplay = document.getElementById('currentMlDisplay');
    const percentDisplay = document.getElementById('percentDisplay');
    const goalDisplay = document.getElementById('goalDisplay');
    const progressMessage = document.getElementById('progressMessage');
    
    const slider = document.getElementById('waterSlider');
    const sliderValueLabel = document.getElementById('sliderValueLabel');
    const addSliderBtn = document.getElementById('addSliderBtn');
    
    const add200Btn = document.getElementById('add200Btn');
    const add300Btn = document.getElementById('add300Btn');
    const resetBtn = document.getElementById('resetBtn');
    
    const goalInput = document.getElementById('goalInput');
    const applyGoalBtn = document.getElementById('applyGoalBtn');
  
    // вспомогательные функции 
    function clampWater(value) {
      // Не позволяем уйти в минус, верхнего предела нет (можно хоть 10 литров)
      return Math.max(0, value);
    }
  
    // обновление всей графики и текста
    function updateUI() {
      // 1. процент заполнения стакана (относительно цели, но максимум 100% визуально)
      let fillPercent = (currentWater / dailyGoal) * 100;
      fillPercent = Math.min(fillPercent, 100); // стакан не переполняется визуально выше 100%
      
      // высота воды (0..100%)
      waterFill.style.height = fillPercent + '%';
      
      // 2. цифры внутри стакана
      currentMlDisplay.innerHTML = `${currentWater} <small>мл</small>`;
      const percentValue = Math.min(Math.round((currentWater / dailyGoal) * 100), 100);
      percentDisplay.textContent = `${percentValue}%`;
      
      // 3. шапка (цель)
      goalDisplay.textContent = `Цель: ${dailyGoal} мл`;
      
      // 4. прогресс сообщение
      progressMessage.textContent = `Выпито ${currentWater} из ${dailyGoal} мл`;
      
      // 5. слайдер лейбл
      sliderValueLabel.textContent = `${slider.value} мл`;
      
      // синхронизируем goalInput с dailyGoal (если кто-то менял через apply, но не потеряем)
      if (Number(goalInput.value) !== dailyGoal) {
        goalInput.value = dailyGoal;
      }
    }
  
    // функция добавления воды
    function addWater(amount) {
      if (amount <= 0) return;
      currentWater = clampWater(currentWater + amount);
      updateUI();
    }
  
    // сброс
    function resetWater() {
      currentWater = 0;
      updateUI();
    }
  
    // установка новой цели
    function setNewGoal(newGoal) {
      // валидация: минимум 200 мл, максимум 8000 (разумно)
      let goal = Number(newGoal);
      if (isNaN(goal) || goal < 200) goal = 200;
      if (goal > 8000) goal = 8000;
      dailyGoal = Math.round(goal);
      
      // если текущая вода превышает новую цель - процент отобразится > 100, но визуал ограничен 100% 
      // это нормально, стакан просто полный
      updateUI();
    }
  
    // обработчик слайдера
    function updateSliderLabel() {
      sliderValueLabel.textContent = `${slider.value} мл`;
    }
  
    // инициализация и привязка событий
    function init() {
      // синхронизация начальных значений
      goalInput.value = dailyGoal;
      slider.value = 250;
      updateUI();
      
      // слушатели кнопок
      add200Btn.addEventListener('click', () => addWater(200));
      add300Btn.addEventListener('click', () => addWater(300));
      resetBtn.addEventListener('click', resetWater);
      
      // слайдер + кнопка "добавить"
      slider.addEventListener('input', updateSliderLabel);
      addSliderBtn.addEventListener('click', () => {
        const amount = parseInt(slider.value, 10);
        if (!isNaN(amount) && amount > 0) {
          addWater(amount);
        }
      });
      
      // двойной клик по слайдеру (для удобства)
      slider.addEventListener('dblclick', () => {
        const amount = parseInt(slider.value, 10);
        if (!isNaN(amount) && amount > 0) addWater(amount);
      });
      
      // установка цели
      applyGoalBtn.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value, 10);
        setNewGoal(newGoal);
      });
      
      // разрешаем ввод по Enter в поле цели
      goalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const newGoal = parseInt(goalInput.value, 10);
          setNewGoal(newGoal);
        }
      });
    }
  
    // запуск
    init();
  })();
