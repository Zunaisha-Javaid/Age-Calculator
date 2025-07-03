class AgeCalculator {
        constructor() {
            this.birthDateInput = document.getElementById('birthDate');
            this.resultsSection = document.getElementById('resultsSection');
            this.yearsElement = document.getElementById('years');
            this.monthsElement = document.getElementById('months');
            this.daysElement = document.getElementById('days');
            this.countdownTimer = document.getElementById('countdownTimer');
            this.countdownLabel = document.getElementById('countdownLabel');
            this.birthDayElement = document.getElementById('birthDay');
            this.ageGroupElement = document.getElementById('ageGroup');
            this.ageGroupIcon = document.getElementById('ageGroupIcon');
            this.themeToggle = document.getElementById('themeToggle');
            this.themeIcon = document.getElementById('themeIcon');

            this.countdownInterval = null;

            this.init();
        }

        init() {
            const today = new Date().toISOString().split('T')[0];
            this.birthDateInput.max = today;

            this.birthDateInput.addEventListener('change', () => this.handleDateChange());
            this.themeToggle.addEventListener('click', () => this.toggleTheme());

            this.initializeTheme();
            this.setupResultAnimations();
        }

        initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        }

        updateThemeIcon(theme) {
            this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }

        handleDateChange() {
            const birthDate = new Date(this.birthDateInput.value);

            if (!this.birthDateInput.value || isNaN(birthDate)) {
                this.hideResults();
                return;
            }
            const today = new Date();
            if (birthDate > today) {
                alert('Birth date cannot be in the future!');
                this.birthDateInput.value = '';
                this.hideResults();
                return;
            }

            this.calculateAge(birthDate);
            this.showResults();
        }

        calculateAge(birthDate) {
            const today = new Date();

            const ageData = this.calculateExactAge(birthDate, today);


            this.updateAgeDisplay(ageData);
            this.displayBirthDayInfo(birthDate);
            this.displayAgeGroup(ageData.years);


            this.startBirthdayCountdown(birthDate);
        }

        calculateExactAge(birthDate, currentDate) {
            let years = currentDate.getFullYear() - birthDate.getFullYear();
            let months = currentDate.getMonth() - birthDate.getMonth();
            let days = currentDate.getDate() - birthDate.getDate();

            if (days < 0) {
                months--;
                const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
                days += daysInPrevMonth;
            }


            if (months < 0) {
                years--;
                months += 12;
            }

            return { years, months, days };
        }

        updateAgeDisplay(ageData) {
            this.animateNumber(this.yearsElement, ageData.years);
            this.animateNumber(this.monthsElement, ageData.months);
            this.animateNumber(this.daysElement, ageData.days);
        }

        animateNumber(element, targetValue) {
            const currentValue = parseInt(element.textContent) || 0;
            const increment = targetValue > currentValue ? 1 : -1;
            const step = Math.abs(targetValue - currentValue) / 20; // 20 steps for smooth animation

            let current = currentValue;
            const timer = setInterval(() => {
                current += increment * Math.max(1, Math.floor(step));

                if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
                    current = targetValue;
                    clearInterval(timer);
                }

                element.textContent = current;
            }, 50);
        }

        displayBirthDayInfo(birthDate) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

            const dayName = days[birthDate.getDay()];
            const monthName = months[birthDate.getMonth()];
            const date = birthDate.getDate();
            const year = birthDate.getFullYear();

            this.birthDayElement.textContent = `${dayName}, ${monthName} ${date}, ${year}`;
        }

        displayAgeGroup(years) {
            let ageGroup, icon;

            if (years < 13) {
                ageGroup = 'Child';
                icon = '👶';
            } else if (years < 20) {
                ageGroup = 'Teenager';
                icon = '🧒';
            } else if (years < 60) {
                ageGroup = 'Adult';
                icon = '🧑';
            } else {
                ageGroup = 'Senior';
                icon = '👴';
            }

            this.ageGroupElement.textContent = ageGroup;
            this.ageGroupIcon.textContent = icon;
        }

        startBirthdayCountdown(birthDate) {
            // Clear existing interval
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }

            const updateCountdown = () => {
                const now = new Date();
                const nextBirthday = this.getNextBirthday(birthDate, now);
                const timeLeft = nextBirthday - now;

                if (timeLeft <= 0) {
                    this.countdownTimer.textContent = '🎉 Happy Birthday! 🎉';
                    this.countdownLabel.textContent = 'Celebrating your special day!';
                    return;
                }

                const timeComponents = this.calculateTimeComponents(timeLeft);
                this.displayCountdown(timeComponents);
            };


            updateCountdown();
            this.countdownInterval = setInterval(updateCountdown, 1000);
        }

        getNextBirthday(birthDate, currentDate) {
            const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

            if (nextBirthday <= currentDate) {
                nextBirthday.setFullYear(currentDate.getFullYear() + 1);
            }

            return nextBirthday;
        }

        calculateTimeComponents(milliseconds) {
            const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
            const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds };
        }

        displayCountdown(timeComponents) {
            const { days, hours, minutes, seconds } = timeComponents;

            if (days > 0) {
                this.countdownTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                this.countdownLabel.textContent = `${days} day${days !== 1 ? 's' : ''} until your birthday!`;
            } else if (hours > 0) {
                this.countdownTimer.textContent = `${hours}h ${minutes}m ${seconds}s`;
                this.countdownLabel.textContent = 'Less than a day to go!';
            } else {
                this.countdownTimer.textContent = `${minutes}m ${seconds}s`;
                this.countdownLabel.textContent = 'Almost there!';
            }
        }

        showResults() {
            this.resultsSection.classList.remove('hidden');


            setTimeout(() => {
                const resultItems = document.querySelectorAll('.result-item');
                resultItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
            }, 100);
        }

        hideResults() {
            this.resultsSection.classList.add('hidden');
            const resultItems = document.querySelectorAll('.result-item');
            resultItems.forEach(item => item.classList.remove('animate'));

            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        }

        setupResultAnimations() {
            const resultItems = document.querySelectorAll('.result-item');
            resultItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.animation = 'pulse 0.6s ease-in-out';
                });

                item.addEventListener('animationend', () => {
                    item.style.animation = '';
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {

            window.ageCalculator = new AgeCalculator();

    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.ageCalculator) {
            const birthDateInput = document.getElementById('birthDate');
            if (birthDateInput.value) {
                window.ageCalculator.handleDateChange();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Clear date input and hide results
            const birthDateInput = document.getElementById('birthDate');
            birthDateInput.value = '';
            birthDateInput.dispatchEvent(new Event('change'));
        }
    });

    window.addEventListener('error', (e) => {
        console.error('Age Calculator Error:', e.error);
    });