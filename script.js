// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmVtythn9zQmUI8GFQulCY4C2EKldQ_nE",
    authDomain: "moonfolio-52c24.firebaseapp.com",
    projectId: "moonfolio-52c24",
    storageBucket: "moonfolio-52c24.appspot.com",
    messagingSenderId: "748130767550",
    appId: "1:748130767550:web:c8947fe14a4d4ead7fc4ef",
    measurementId: "G-RHGTQ8GZT2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function() {
    // Element References
    const cryptoForm = document.getElementById("cryptoForm");
    const coinSearch = $('#coinSearch');
    const portfolioTable = document.getElementById("portfolioTable");
    const totalInvestmentEl = document.getElementById("totalInvestment");
    const totalProfitEl = document.getElementById("totalProfit");
    const totalPercentageEl = document.getElementById("totalPercentage");
    const currentMarketCapEl = document.getElementById("currentMarketCap");
    const baseCaseMCEl = document.getElementById("baseCaseMC");
    const moonCaseMCEl = document.getElementById("moonCaseMC");
    const baseCaseMCManualEl = document.getElementById("baseCaseMCManual");
    const moonCaseMCManualEl = document.getElementById("moonCaseMCManual");
    const baseCaseBalanceEl = document.getElementById("baseCaseBalance");
    const moonCaseBalanceEl = document.getElementById("moonCaseBalance");
    const confirmationModal = document.getElementById("confirmationModal");
    const closeConfirmationModal = document.getElementById("closeConfirmationModal");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");
    const emailVerificationContainer = document.getElementById("emailVerificationContainer");
    const resendVerificationButton = document.getElementById("resendVerificationButton");
    const resendVerificationMessage = document.getElementById("resendVerificationMessage");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotPasswordModal = document.getElementById("closeForgotPasswordModal");
    const forgotPasswordButton = document.getElementById("forgotPasswordButton");
    const resetPasswordEmailInput = document.getElementById("resetPasswordEmail");
    const resetPasswordMessage = document.getElementById("resetPasswordMessage");
    const upgradeModal = document.getElementById("upgradeModal");
    const closeUpgradeModal = document.getElementById("closeUpgradeModal");
    const upgradeButton = document.getElementById("upgradeButton");
    const checkoutButton = document.getElementById('checkout-button');
    const baseCaseMultiplierManualEl = document.getElementById("baseCaseMultiplierManual");
    const moonCaseMultiplierManualEl = document.getElementById("moonCaseMultiplierManual");
    const signInButton = document.getElementById('signInButton');
    const signUpButton = document.getElementById('signUpButton');
    const signOutButton = document.getElementById('signOutButton');
    const signInModalButton = document.getElementById('signInModalButton');
    const signUpModalButton = document.getElementById('signUpModalButton');
    const closeAuthModalButton = document.querySelector('.close-button');
    const closeAddCoinButton = document.getElementById('closeAddCoinModal');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signUpEmailInput = document.getElementById('signUpEmail');
    const signUpPasswordInput = document.getElementById('signUpPassword');
    const authContainer = document.getElementById('authContainer');
    const userContainer = document.getElementById('userContainer');
    const userEmail = document.getElementById('userEmail');
    const errorMessage = document.getElementById('errorMessage');
    const signUpErrorMessage = document.getElementById('signUpErrorMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const signUpLoadingIndicator = document.getElementById('signUpLoadingIndicator');
    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleSignUpPasswordButton = document.getElementById('toggleSignUpPassword');
    const authModal = document.getElementById('authModal');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');
    const addCoinButton = document.getElementById('addCoinButton');
    const addCoinModal = document.getElementById('addCoinModal');
    const stripe = Stripe('pk_live_51LmKU1CF77PCDzZf39h4Who3XS36f4S2BVluv9OLieaQqUtkAefVmukrf03RVAlTeeHXj4h99zsNP8mfdw7RCzyM00P8UFIoYJ'); // Your live mode publishable key


    let coinToRemoveIndex = null;
    let portfolio = [];
    let totalInvestment = 0;
    let totalProfit = 0;
    let baseCaseBalance = 0;
    let moonCaseBalance = 0;
    let coinData = [];
    let userSubscription = 'free';

    function showEmailVerificationScreen() {
        authContainer.style.display = 'none';
        emailVerificationContainer.style.display = 'block';
    }

    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close-button');

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });

    

    // Enable scrolling within the modal content
    modals.forEach(modal => {
        modal.querySelector('.modal-content').addEventListener('touchmove', function(event) {
            // Allow touchmove event on modal content to enable scrolling
            event.stopPropagation();
        }, { passive: false });

        modal.addEventListener('touchmove', function(event) {
            // Prevent touchmove on modal background to avoid scrolling the background
            if (event.target === modal) {
                event.preventDefault();
            }
        }, { passive: false });
    });

    const feedbackButton = document.getElementById('feedbackButton');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackEmailInput = document.getElementById('feedbackEmail');
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
            toastContainer.removeChild(toast);
        }, 3000);
    }

    if (feedbackButton) {
        feedbackButton.addEventListener('click', function() {
            if (auth.currentUser) {
                feedbackEmailInput.value = auth.currentUser.email;
            }
            feedbackModal.style.display = 'block';
        });
    }

    if (closeFeedbackModal) {
        closeFeedbackModal.addEventListener('click', function() {
            feedbackModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const serviceID = 'service_rwratos'; // Replace with your actual EmailJS service ID
            const templateID = 'template_hu8h5er'; // Replace with your actual EmailJS template ID

            emailjs.sendForm(serviceID, templateID, feedbackForm)
                .then(function(response) {
                    console.log('Feedback submitted successfully:', response.status, response.text);
                    feedbackModal.style.display = 'none';
                    feedbackForm.reset();
                    showToast('Thank you for your feedback!');
                }, function(error) {
                    console.error('Failed to send feedback:', error);
                    showToast('Failed to send feedback. Please try again later.');
                });
        });
    }

    // Event Listeners and Handlers
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordButton.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                togglePasswordButton.textContent = 'Show';
            }
        });
    }

    if (toggleSignUpPasswordButton) {
        toggleSignUpPasswordButton.addEventListener('click', function() {
            if (signUpPasswordInput.type === 'password') {
                signUpPasswordInput.type = 'text';
                toggleSignUpPasswordButton.textContent = 'Hide';
            } else {
                signUpPasswordInput.type = 'password';
                toggleSignUpPasswordButton.textContent = 'Show';
            }
        });
    }

    if (signInModalButton) {
        signInModalButton.addEventListener('click', function() {
            openModal('Sign In');
        });
    }

    if (signUpModalButton) {
        signUpModalButton.addEventListener('click', function() {
            openModal('Sign Up');
        });
    }

    if (closeAuthModalButton) {
        closeAuthModalButton.addEventListener('click', function() {
            closeModal();
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == authModal) {
            closeModal();
        }
    });

    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', function(event) {
            event.preventDefault();
            toggleForms('Sign Up');
        });
    }
    
    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', function(event) {
            event.preventDefault();
            toggleForms('Sign In');
        });
    }
    

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });
    }

    if (closeForgotPasswordModal) {
        closeForgotPasswordModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        };
    });

    if (signUpButton) {
        signUpButton.addEventListener('click', function() {
            const email = signUpEmailInput.value;
            const password = signUpPasswordInput.value;
            signUpErrorMessage.textContent = '';
            signUpLoadingIndicator.style.display = 'block';

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    console.log('User signed up:', userCredential.user);
                    userCredential.user.sendEmailVerification()
                        .then(() => {
                            console.log('Verification email sent.');
                            showEmailVerificationScreen();
                            closeModal();
                        })
                        .catch(error => {
                            console.error('Error sending verification email:', error.message);
                            signUpErrorMessage.textContent = error.message;
                        });
                })
                .catch(error => {
                    console.error('Error signing up:', error.message);
                    signUpErrorMessage.textContent = error.message;
                })
                .finally(() => {
                    signUpLoadingIndicator.style.display = 'none';
                });
        });
    }

    if (resendVerificationButton) {
        resendVerificationButton.addEventListener('click', function() {
            const user = auth.currentUser;
            if (user) {
                user.sendEmailVerification().then(() => {
                    resendVerificationMessage.textContent = 'Verification email sent.';
                    resendVerificationMessage.style.display = 'block';
                }).catch(error => {
                    console.error('Error sending verification email:', error.message);
                    resendVerificationMessage.textContent = 'Error sending verification email. Please try again later.';
                    resendVerificationMessage.style.display = 'block';
                });
            }
        });
    }

    if (signInButton) {
        signInButton.addEventListener('click', function() {
            const email = emailInput.value;
            const password = passwordInput.value;
            errorMessage.textContent = '';
            loadingIndicator.style.display = 'block';

            console.log('Attempting to sign in with:', email, password); // Add this line for logging

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    if (userCredential.user.emailVerified) {
                        console.log('User signed in:', userCredential.user);
                        userEmail.textContent = userCredential.user.email;
                        authContainer.style.display = 'none';
                        userContainer.style.display = 'block';
                        emailVerificationContainer.style.display = 'none'; // Hide the verification message upon successful sign-in
                        createUserDocumentIfNotExists(userCredential.user.uid, email).then(() => {
                            loadUserData(userCredential.user.uid);
                        });
                        closeModal();
                        updateAuthUI(true);
                    } else {
                        auth.signOut();
                        errorMessage.textContent = 'Please verify your email address before signing in.';
                        showEmailVerificationScreen();
                    }
                })
                .catch(error => {
                    console.error('Error signing in:', error.message); // Update this line for more detailed logging
                    errorMessage.textContent = error.message;
                })
                .finally(() => {
                    loadingIndicator.style.display = 'none';
                });
        });
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', function() {
            auth.signOut().then(() => {
                console.log('User signed out');
                updateAuthUI(false);
                authContainer.style.display = 'block';
                userContainer.style.display = 'none';
                emailVerificationContainer.style.display = 'none'; // Hide the verification message upon sign-out
                clearLocalStorage();
            }).catch(error => {
                console.error('Error signing out:', error.message);
            });
        });
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            user.reload().then(() => {
                if (user.emailVerified) {
                    console.log('User is signed in and verified');
                    userEmail.textContent = user.email;
                    authContainer.style.display = 'none';
                    userContainer.style.display = 'block';
                    emailVerificationContainer.style.display = 'none';
                    createUserDocumentIfNotExists(user.uid, user.email).then(() => {
                        loadUserData(user.uid).then(() => {
                            updateAuthUI(true);
                        });
                    });
                    closeModal();
                } else {
                    console.log('User is signed in but not verified');
                    showEmailVerificationScreen(); // Ensure this is correctly called
                }
            }).catch(error => {
                console.error('Error reloading user:', error);
            });
        } else {
            console.log('No user is signed in');
            updateAuthUI(false);
            authContainer.style.display = 'block';
            userContainer.style.display = 'none';
            emailVerificationContainer.style.display = 'none';
            clearLocalStorage();
        }
    });

    function setDataLabels() {
        const headers = Array.from(document.querySelectorAll("th")).map(th => th.textContent);
        document.querySelectorAll("tbody tr").forEach(row => {
            row.querySelectorAll("td").forEach((cell, index) => {
                cell.setAttribute("data-label", headers[index]);
            });
        });
    }

    setDataLabels();

    // Fetch the latest prices for all coins in the portfolio
async function updatePortfolioPrices() {
    for (const coin of portfolio) {
        try {
            const { currentPrice, marketCap, circulatingSupply } = await fetchCurrentPriceAndMarketCap(coin.id);
            const currentValue = coin.coinsBought * currentPrice;
            const profit = currentValue - coin.invested;
            coin.current = currentValue;
            coin.profit = profit;
            coin.currentPrice = currentPrice;
            coin.marketCap = marketCap;

            const today = new Date().toISOString().split('T')[0];
            const history = coin.history.find(entry => entry.date === today);
            if (!history) {
                coin.history.push({
                    date: today,
                    price: currentPrice
                });
            }
        } catch (error) {
            console.error(`Error updating current price or market cap: ${error.message}`);
        }
    }

    savePortfolioToFirebase(); // Save the updated portfolio to Firebase
}

    async function loadUserData(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            if (doc.exists) {
                console.log('Document data:', doc.data());
                portfolio = doc.data().portfolio || [];
                userSubscription = doc.data().subscription || 'free';
                await updatePortfolioPrices(); // Fetch the latest prices from CoinGecko
                localStorage.setItem('portfolio', JSON.stringify(portfolio));
                updatePortfolioTable();
                updateTotals();
                if (userSubscription === 'premium') {
                    console.log('User is a premium member.');
                    enablePremiumFeatures();
                    checkoutButton.style.display = 'none'; // Hide button for premium users
                } else {
                    console.log('User is a free member.');
                    checkoutButton.style.display = 'inline-block'; // Show button for free users
                }
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error getting document:', error);
        }
    }

    function createUserDocument(uid, email) {
        return db.collection('users').doc(uid).set({
            email: email,
            portfolio: [],
            subscription: 'free'
        }).then(() => {
            console.log('User document created successfully!');
        }).catch(error => {
            console.error('Error creating user document:', error);
        });
    }

    function clearLocalStorage() {
        localStorage.removeItem('portfolio');
        portfolio = [];
        updatePortfolioTable();
        updateTotals();
    }

    function enablePremiumFeatures() {
        console.log('Premium features enabled');
        // Any additional premium features enabling logic here
    }

    // Add this function to save portfolio updates to Firebase
async function savePortfolioToFirebase() {
    const user = auth.currentUser;
    if (user) {
        try {
            await db.collection('users').doc(user.uid).set({
                portfolio: portfolio,
                subscription: userSubscription
            }, { merge: true }); // Use merge to avoid overwriting the entire document
            console.log('Portfolio saved to Firebase!');
        } catch (error) {
            console.error('Error saving portfolio to Firebase:', error);
        }
    }
}

    async function saveUserData(uid) {
        try {
            await db.collection('users').doc(uid).set({
                portfolio: portfolio,
                subscription: userSubscription
            }, { merge: true }); // Use merge to avoid overwriting the entire document
            console.log('User data saved successfully!');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
    

    const multipliers = [2, 5, 10, 20, 50, 100, 250, 500, 1000, 1500];

    baseCaseMCManualEl.disabled = true;
    moonCaseMCManualEl.disabled = true;

    baseCaseMCEl.addEventListener('change', function() {
        const isManual = baseCaseMCEl.value === 'manual';
        baseCaseMCManualEl.disabled = !isManual;
        baseCaseMultiplierManualEl.disabled = !isManual;
        if (!isManual) {
            baseCaseMCManualEl.value = '';
            baseCaseMultiplierManualEl.value = '';
        }
    });

    moonCaseMCEl.addEventListener('change', function() {
        const isManual = moonCaseMCEl.value === 'manual';
        moonCaseMCManualEl.disabled = !isManual;
        moonCaseMultiplierManualEl.disabled = !isManual;
        if (!isManual) {
            moonCaseMCManualEl.value = '';
            moonCaseMultiplierManualEl.value = '';
        }
    });

    baseCaseMCManualEl.addEventListener('input', function() {
        const currentMarketCap = parseFloat(currentMarketCapEl.value.replace(/,/g, ''));
        const marketCapValue = parseFloat(baseCaseMCManualEl.value);
        if (!isNaN(marketCapValue) && currentMarketCap) {
            baseCaseMultiplierManualEl.value = (marketCapValue / currentMarketCap).toFixed(2);
        }
    });

    baseCaseMultiplierManualEl.addEventListener('input', function() {
        const currentMarketCap = parseFloat(currentMarketCapEl.value.replace(/,/g, ''));
        const multiplierValue = parseFloat(baseCaseMultiplierManualEl.value);
        if (!isNaN(multiplierValue) && currentMarketCap) {
            baseCaseMCManualEl.value = (currentMarketCap * multiplierValue).toFixed(2);
        }
    });

    moonCaseMCManualEl.addEventListener('input', function() {
        const currentMarketCap = parseFloat(currentMarketCapEl.value.replace(/,/g, ''));
        const marketCapValue = parseFloat(moonCaseMCManualEl.value);
        if (!isNaN(marketCapValue) && currentMarketCap) {
            moonCaseMultiplierManualEl.value = (marketCapValue / currentMarketCap).toFixed(2);
        }
    });

    moonCaseMultiplierManualEl.addEventListener('input', function() {
        const currentMarketCap = parseFloat(currentMarketCapEl.value.replace(/,/g, ''));
        const multiplierValue = parseFloat(moonCaseMultiplierManualEl.value);
        if (!isNaN(multiplierValue) && currentMarketCap) {
            moonCaseMCManualEl.value = (currentMarketCap * multiplierValue).toFixed(2);
        }
    });

    async function fetchCoins() {
        let allCoins = [];
        let page = 1;
        const pageSize = 250;
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        while (page <= 5) { // Adjust the number of pages to fetch more coins
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${pageSize}&page=${page}`, {
                    headers: {
                        'Accept': 'application/json'
                    },
                    method: 'GET'
                });
                const coins = await response.json();
                if (coins.length === 0) break;
                allCoins = allCoins.concat(coins);
                console.log(`Fetched page ${page}, got ${coins.length} coins.`);
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
            }
            page++;
            await delay(2000);
        }

        return allCoins;
    }

    function preloadCoins() {
        const cachedCoins = localStorage.getItem('coinData');
        if (cachedCoins) {
            coinData = JSON.parse(cachedCoins);
            setupAutocomplete();
        } else {
            fetchCoins()
                .then(coins => {
                    coinData = coins.map(coin => ({
                        id: coin.id,
                        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
                        value: coin.name,
                        image: coin.image
                    }));
                    localStorage.setItem('coinData', JSON.stringify(coinData));
                    setupAutocomplete();
                })
                .catch(error => console.error('Error fetching coin list:', error));
        }
    }

    function setupAutocomplete() {
        coinSearch.autocomplete({
            source: coinData,
            minLength: 2,
            select: function(event, ui) {
                coinSearch.data('coin-id', ui.item.id);
                fetchCurrentPriceAndMarketCap(ui.item.id);
            }
        }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append(`<div><img src="${item.image}" class="coin-select-icon"> ${item.label}</div>`)
                .appendTo(ul);
        };
    }

    preloadCoins();

    if (cryptoForm) {
        cryptoForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const investmentDate = document.getElementById("investmentDate").value;
            const normalizedInvestmentDate = normalizeDateToUTC(investmentDate);
            const formattedDate = formatDate(normalizedInvestmentDate);

            console.log(`Normalized Date for Storage: ${normalizedInvestmentDate}`);
            console.log(`Formatted Date for Display: ${normalizeDateForDisplay(normalizedInvestmentDate)}`);
            const today = new Date().toISOString().split('T')[0];
            const now = new Date();
            const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            if (investmentDate > localDate) {
                alert('The investment date cannot be in the future.');
                return;
            }

            if (auth.currentUser === null && portfolio.length >= 1) {
                addCoinModal.style.display = 'none';
                openModal('Sign Up');
                return;
            }

            if (userSubscription === 'free' && portfolio.length >= 4) {
                upgradeModal.style.display = 'block';
                return;
            }

            const coinId = coinSearch.data('coin-id');
            if (!coinId) {
                alert('Please select a valid coin.');
                return;
            }

            const coinName = coinSearch.val().trim();
            const amountInvested = parseFloat(document.getElementById("amountInvested").value);
            const currentMarketCap = parseFloat(currentMarketCapEl.value.replace(/,/g, ''));

            const baseCaseMC = baseCaseMCManualEl.value ? parseFloat(baseCaseMCManualEl.value) : parseFloat(baseCaseMCEl.value);
            const moonCaseMC = moonCaseMCManualEl.value ? parseFloat(moonCaseMCManualEl.value) : parseFloat(moonCaseMCEl.value);

            console.log(`Fetching historical price for ${coinId} on ${formattedDate}`);

            fetchHistoricalPrice(coinId, formattedDate)
                .then(investmentPrice => {
                    const coinsBought = amountInvested / investmentPrice;

                    fetchCurrentPriceAndMarketCap(coinId)
                        .then(({ currentPrice, marketCap, circulatingSupply }) => {
                            const currentValue = coinsBought * currentPrice;
                            const profit = currentValue - amountInvested;

                            const baseCaseTargetPrice = investmentPrice * (baseCaseMC / currentMarketCap);
                            const moonCaseTargetPrice = investmentPrice * (moonCaseMC / currentMarketCap);

                            const baseCaseROI = (baseCaseTargetPrice / currentPrice).toFixed(2);
                            const moonCaseROI = (moonCaseTargetPrice / currentPrice).toFixed(2);

                            fetchCoinImage(coinId)
                                .then(image => {
                                    const coin = {
                                        id: coinId,
                                        name: coinName,
                                        image: image,
                                        price: investmentPrice,
                                        currentPrice: currentPrice,
                                        marketCap: marketCap,
                                        invested: amountInvested,
                                        current: currentValue,
                                        profit: profit,
                                        date: normalizedInvestmentDate,
                                        coinsBought: coinsBought,
                                        baseCaseMC: baseCaseMC,
                                        baseCaseROI: baseCaseROI,
                                        moonCaseMC: moonCaseMC,
                                        moonCaseROI: moonCaseROI,
                                        baseCaseBalance: coinsBought * baseCaseTargetPrice,
                                        moonCaseBalance: coinsBought * moonCaseTargetPrice,
                                        history: [{
                                            date: new Date().toISOString().split('T')[0],
                                            price: currentPrice
                                        }]
                                    };

                                    portfolio.push(coin);
                                    totalInvestment += amountInvested;
                                    totalProfit += profit;

                                    localStorage.setItem('portfolio', JSON.stringify(portfolio));
                                    if (auth.currentUser) {
                                        saveUserData(auth.currentUser.uid);
                                    }
                                    updatePortfolioTable();
                                    updateTotals();
                                    closeAddCoinModal();
                                    cryptoForm.reset();
                                    coinSearch.val('');
                                    coinSearch.data('coin-id', null);
                                })
                                .catch(error => {
                                    console.error(`Error fetching coin image: ${error.message}`);
                                });
                        })
                        .catch(error => {
                            alert('Error fetching the current price or market cap. Please check the coin name.');
                            console.error(`Error fetching current price or market cap: ${error.message}`);
                        });
                })
                .catch(error => {
                    alert('Error fetching the historical price. Please check the coin name and date.');
                    console.error(`Error fetching data: ${error.message}`);
                });
                addCoinModal.style.display = 'none';
        });

        function addTransaction(transaction) {
            portfolio.push(transaction);
            updatePortfolioTable();
            updateTotals();
            savePortfolioToFirebase(); // Save updates to Firebase
        }

        function updatePortfolioTable() {
            console.log('Updating portfolio table...');
            portfolioTable.innerHTML = ''; // Clear the existing rows
            portfolio.forEach((coin, index) => {
                const baseCaseAmount = (coin.baseCaseROI * coin.current).toFixed(2);
                const moonCaseAmount = (coin.moonCaseROI * coin.current).toFixed(2);

                const formattedProfit = coin.profit < 0 
                    ? `-$${formatNumberWithCommas(Math.abs(coin.profit).toFixed(2))}` 
                    : `+$${formatNumberWithCommas(coin.profit.toFixed(2))}`;

                const formattedDate = formatDateToUTC(coin.date);

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td> <!-- Coin number column -->
                    <td class="coin-cell"><img src="${coin.image}" alt="${coin.name}" class="coin-icon"><span>${coin.name}</span></td>
                    <td>${formattedDate}</td>
                    <td>$${formatNumberWithCommas((coin.currentPrice).toFixed(2))}</td>
                    <td>$${formatNumberWithCommas((coin.invested || 0).toFixed(2))}</td>
                    <td>$${formatNumberWithCommas(baseCaseAmount)} (${coin.baseCaseROI}x)</td>
                    <td>$${formatNumberWithCommas(moonCaseAmount)} (${coin.moonCaseROI}x)</td>
                    <td>
                        $${formatNumberWithCommas((coin.current || 0).toFixed(2))}<br>
                        <span class="${coin.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${formattedProfit}</span>
                    </td>
                    <td><button class="remove-button" data-index="${index}">Remove</button></td>
                `;
                portfolioTable.appendChild(row);
                console.log(`Added row for coin ${index + 1}: ${coin.name}`);
            });
            attachRemoveEventListeners();
        }

        function formatDateToUTC(dateString) {
            const date = new Date(dateString + 'T00:00:00Z');
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function normalizeDateToUTC(dateString) {
            const date = new Date(dateString);
            const utcYear = date.getUTCFullYear();
            const utcMonth = ('0' + (date.getUTCMonth() + 1)).slice(-2);
            const utcDay = ('0' + date.getUTCDate()).slice(-2);
            return `${utcYear}-${utcMonth}-${utcDay}`;
        }

        function normalizeDateForDisplay(dateString) {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }

            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        }

        function attachRemoveEventListeners() {
            document.querySelectorAll('.remove-button').forEach(button => {
                button.addEventListener('click', function() {
                    coinToRemoveIndex = this.getAttribute('data-index');
                    confirmationModal.style.display = 'block';
                });
            });
        }

        function fetchHistoricalPrice(coinId, date, retries = 5) {
            return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}`)
                .then(response => {
                    if (response.status === 429) {
                        if (retries > 0) {
                            const retryDelay = Math.pow(2, 5 - retries) * 1000;
                            return new Promise(resolve => setTimeout(resolve, retryDelay))
                                .then(() => fetchHistoricalPrice(coinId, date, retries - 1));
                        } else {
                            throw new Error('Too many requests. Please try again later.');
                        }
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.market_data) {
                        return data.market_data.current_price.usd;
                    } else {
                        throw new Error('No market data available for this date.');
                    }
                })
                .catch(error => {
                    throw new Error(`Error fetching historical price: ${error.message}`);
                });
        }
    }

    const investmentDateInput = document.getElementById("investmentDate");
    if (investmentDateInput) {
        const now = new Date();
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        investmentDateInput.setAttribute('max', localDate);
    }

    function formatDisplayDate(dateString) {
        const date = new Date(dateString + 'T00:00:00Z');
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate;
    }

    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }

    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatPrice(price) {
        return price >= 1 ? price.toFixed(2) : price.toFixed(6);
    }

    function abbreviateNumber(number) {
        if (number >= 1e9) {
            return (number / 1e9).toFixed(2) + 'B';
        } else if (number >= 1e6) {
            return (number / 1e6).toFixed(2) + 'M';
        } else {
            return number.toFixed(2);
        }
    }

    function fetchCurrentPriceAndMarketCap(coinId) {
        return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then(response => response.json())
            .then(data => {
                if (data.market_data) {
                    const currentMarketCap = data.market_data.market_cap.usd;
                    currentMarketCapEl.value = formatNumberWithCommas(currentMarketCap.toFixed(2));

                    populateMultipliers(currentMarketCap, baseCaseMCEl, multipliers);
                    populateMultipliers(currentMarketCap, moonCaseMCEl, multipliers, 1500);

                    return {
                        currentPrice: data.market_data.current_price.usd,
                        marketCap: currentMarketCap,
                        circulatingSupply: data.market_data.circulating_supply
                    };
                } else {
                    throw new Error('Market data not available.');
                }
            })
            .catch(error => {
                throw new Error(`Error fetching current price or market cap: ${error.message}`);
            });
    }

    function populateMultipliers(currentMarketCap, element, multipliers, maxMultiplier = 250) {
        element.innerHTML = '<option value="" disabled selected>Select multiplier</option>';
        element.innerHTML += '<option value="manual">Input manually</option>';
        multipliers.forEach(multiplier => {
            if (multiplier <= maxMultiplier) {
                const option = document.createElement('option');
                option.value = (currentMarketCap * multiplier).toFixed(2);
                option.textContent = `${(currentMarketCap * multiplier).toFixed(2)} (${multiplier}x)`;
                element.appendChild(option);
            }
        });
    }

    function fetchCoinImage(coinId) {
        return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then(response => response.json())
            .then(data => {
                if (data.image) {
                    return data.image.thumb;
                } else {
                    throw new Error('Image data not available.');
                }
            })
            .catch(error => {
                throw new Error(`Error fetching coin image: ${error.message}`);
            });
    }

    function updatePortfolioTable() {
        console.log('Updating portfolio table...');
        portfolioTable.innerHTML = ''; // Clear the existing rows
        portfolio.forEach((coin, index) => {
            const baseCaseAmount = (coin.baseCaseROI * coin.current).toFixed(2);
            const moonCaseAmount = (coin.moonCaseROI * coin.current).toFixed(2);

            const formattedProfit = coin.profit < 0 
                ? `-$${formatNumberWithCommas(Math.abs(coin.profit).toFixed(2))}` 
                : `+$${formatNumberWithCommas(coin.profit.toFixed(2))}`;

            const formattedDate = formatDisplayDate(coin.date);
            console.log(`Coin ${index + 1}: Original date: ${coin.date}, Formatted date: ${formattedDate}`);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td> <!-- Coin number column -->
                <td class="coin-cell"><img src="${coin.image}" alt="${coin.name}" class="coin-icon"><span>${coin.name}</span></td>
                <td>${formattedDate}</td>
                <td>$${formatNumberWithCommas((coin.currentPrice).toFixed(2))}</td>
                <td>$${formatNumberWithCommas((coin.invested || 0).toFixed(2))}</td>
                <td>$${formatNumberWithCommas(baseCaseAmount)} (${coin.baseCaseROI}x)</td>
                <td>$${formatNumberWithCommas(moonCaseAmount)} (${coin.moonCaseROI}x)</td>
                <td>
                    $${formatNumberWithCommas((coin.current || 0).toFixed(2))}<br>
                    <span class="${coin.profit >= 0 ? 'profit-positive' : 'profit-negative'}">${formattedProfit}</span>
                </td>
                <td><button class="remove-button" data-index="${index}">Remove</button></td>
            `;
            portfolioTable.appendChild(row);
            console.log(`Added row for coin ${index + 1}: ${coin.name}`);
        });
        attachRemoveEventListeners();
    }

    function attachEventListeners() {
        if (togglePasswordButton) {
            togglePasswordButton.addEventListener('click', togglePasswordVisibility);
        }

        if (toggleSignUpPasswordButton) {
            toggleSignUpPasswordButton.addEventListener('click', toggleSignUpPasswordVisibility);
        }

        if (signInModalButton) {
            signInModalButton.addEventListener('click', function() {
                openModal('Sign In');
            });
        }

        if (signUpModalButton) {
            signUpModalButton.addEventListener('click', function() {
                openModal('Sign Up');
            });
        }

        if (closeAuthModalButton) {
            closeAuthModalButton.addEventListener('click', closeModal);
        }

        window.addEventListener('click', function(event) {
            if (event.target == authModal) {
                closeModal();
            }
        });

        if (switchToSignUp) {
            switchToSignUp.addEventListener('click', function(event) {
                event.preventDefault();
                toggleForms('Sign Up');
            });
        }

        if (switchToSignIn) {
            switchToSignIn.addEventListener('click', function(event) {
                event.preventDefault();
                toggleForms('Sign In');
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(event) {
                event.preventDefault();
                forgotPasswordModal.style.display = 'block';
            });
        }

        if (closeForgotPasswordModal) {
            closeForgotPasswordModal.addEventListener('click', function() {
                forgotPasswordModal.style.display = 'none';
            });
        }

        window.addEventListener('click', function(event) {
            if (event.target == forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
            }
        });

        if (forgotPasswordButton) {
            forgotPasswordButton.addEventListener('click', function() {
                const email = resetPasswordEmailInput.value;
                if (email) {
                    auth.sendPasswordResetEmail(email).then(() => {
                        resetPasswordMessage.textContent = 'Password reset email sent.';
                        resetPasswordMessage.style.display = 'block';
                    }).catch(error => {
                        console.error('Error sending password reset email:', error.message);
                        resetPasswordMessage.textContent = 'Error sending password reset email. Please try again later.';
                        resetPasswordMessage.style.display = 'block';
                    });
                } else {
                    resetPasswordMessage.textContent = 'Please enter your email address.';
                    resetPasswordMessage.style.display = 'block';
                }
            });
        }

        if (signInButton) {
            signInButton.addEventListener('click', signIn);
        }

        if (signUpButton) {
            signUpButton.addEventListener('click', signUp);
        }

        if (signOutButton) {
            signOutButton.addEventListener('click', signOut);
        }

        if (resendVerificationButton) {
            resendVerificationButton.addEventListener('click', function() {
                const user = auth.currentUser;
                if (user) {
                    user.sendEmailVerification().then(() => {
                        resendVerificationMessage.textContent = 'Verification email sent.';
                        resendVerificationMessage.style.display = 'block';
                    }).catch(error => {
                        console.error('Error sending verification email:', error.message);
                        resendVerificationMessage.textContent = 'Error sending verification email. Please try again later.';
                        resendVerificationMessage.style.display = 'block';
                    });
                }
            });
        }

        if (checkoutButton) {
            checkoutButton.addEventListener('click', showUpgradeModal);
        }

        if (upgradeButton) {
            upgradeButton.addEventListener('click', upgradeToPremium);
        }

        if (closeUpgradeModal) {
            closeUpgradeModal.addEventListener('click', function() {
                upgradeModal.style.display = 'none';
            });
        }

        window.addEventListener('click', function(event) {
            if (event.target == upgradeModal) {
                upgradeModal.style.display = 'none';
            }
        });

        if (addCoinButton) {
            addCoinButton.addEventListener('click', function() {
                addCoinModal.style.display = 'block';
                console.log("Add coin button is clicked");
            });
        }

        if (closeAddCoinButton) {
            closeAddCoinButton.addEventListener('click', closeAddCoinModal);
        }

        window.addEventListener('click', function(event) {
            if (event.target == addCoinModal) {
                closeAddCoinModal();
            }
        });

        attachRemoveEventListeners();
    }

    function signIn() {
        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessage.textContent = '';
        loadingIndicator.style.display = 'block';

        console.log('Attempting to sign in with:', email, password);

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                if (userCredential.user.emailVerified) {
                    console.log('User signed in:', userCredential.user);
                    userEmail.textContent = userCredential.user.email;
                    authContainer.style.display = 'none';
                    userContainer.style.display = 'block';
                    emailVerificationContainer.style.display = 'none';
                    createUserDocumentIfNotExists(userCredential.user.uid, email).then(() => {
                        loadUserData(userCredential.user.uid).then(() => {
                            updateAuthUI(true);
                        });
                    });
                    closeModal();
                } else {
                    auth.signOut();
                    errorMessage.textContent = 'Please verify your email address before signing in.';
                    showEmailVerificationScreen();
                }
            })
            .catch(error => {
                console.error('Error signing in:', error.message);
                errorMessage.textContent = error.message;
            })
            .finally(() => {
                loadingIndicator.style.display = 'none';
            });
    }

    function signUp() {
        const email = signUpEmailInput.value;
        const password = signUpPasswordInput.value;
        signUpErrorMessage.textContent = '';
        signUpLoadingIndicator.style.display = 'block';

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('User signed up:', userCredential.user);
                userCredential.user.sendEmailVerification()
                    .then(() => {
                        console.log('Verification email sent.');
                        showEmailVerificationScreen();
                        closeModal();
                    })
                    .catch(error => {
                        console.error('Error sending verification email:', error.message);
                        signUpErrorMessage.textContent = error.message;
                    });
            })
            .catch(error => {
                console.error('Error signing up:', error.message);
                signUpErrorMessage.textContent = error.message;
            })
            .finally(() => {
                signUpLoadingIndicator.style.display = 'none';
            });
    }

    function signOut() {
        auth.signOut().then(() => {
            console.log('User signed out');
            updateAuthUI(false);
            authContainer.style.display = 'block';
            userContainer.style.display = 'none';
            emailVerificationContainer.style.display = 'none';
            clearLocalStorage();
        }).catch(error => {
            console.error('Error signing out:', error.message);
        });
    }

    async function upgradeToPremium() {
        upgradeModal.style.display = 'none';
    
        const user = firebase.auth().currentUser;
        if (user) {
            try {
                const response = await fetch('https://moonfolio-nine.vercel.app/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.uid })
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const session = await response.json();
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    console.error(result.error.message);
                }
            } catch (error) {
                console.error('Failed to fetch:', error.message);
            }
        } else {
            alert('You need to sign in first.');
        }
    }
    
    
    
    

    function showUpgradeModal() {
        if (upgradeModal) {
            upgradeModal.style.display = 'block';
        }
    }

    function closeAddCoinModal() {
        addCoinModal.style.display = 'none';
    }

    function togglePasswordVisibility(button, input) {
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = 'Hide';
        } else {
            input.type = 'password';
            button.textContent = 'Show';
        }
    }

    function toggleSignUpPasswordVisibility(button, input) {
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = 'Hide';
        } else {
            input.type = 'password';
            button.textContent = 'Show';
        }
    }

    function toggleForms(mode) {
        const modalTitle = document.getElementById('modalTitle');
        if (mode === 'Sign In') {
            signInForm.style.display = 'block';
            signUpForm.style.display = 'none';
            modalTitle.textContent = 'Sign In';
        } else {
            signInForm.style.display = 'none';
            signUpForm.style.display = 'block';
            modalTitle.textContent = 'Sign Up';
        }
    }
    

    function openModal(mode) {
        const modalTitle = document.getElementById('modalTitle');
        if (mode === 'Sign In') {
            signInForm.style.display = 'block';
            signUpForm.style.display = 'none';
            modalTitle.textContent = 'Sign In';
        } else {
            signInForm.style.display = 'none';
            signUpForm.style.display = 'block';
            modalTitle.textContent = 'Sign Up';
        }
        authModal.style.display = 'block';
    }
    

    function closeModal() {
        authModal.style.display = 'none';
    }

    attachEventListeners();

    if (confirmButton) {
        confirmButton.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Confirm button clicked');
            if (coinToRemoveIndex !== null) {
                removeCoinFromPortfolio(coinToRemoveIndex);
                coinToRemoveIndex = null;
                confirmationModal.style.display = 'none';
            }
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Cancel button clicked');
            confirmationModal.style.display = 'none';
            coinToRemoveIndex = null;
        });
    }

    if (closeConfirmationModal) {
        closeConfirmationModal.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Close button clicked');
            confirmationModal.style.display = 'none';
            coinToRemoveIndex = null;
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == confirmationModal) {
            event.stopPropagation();
            console.log('Window click detected outside modal');
            confirmationModal.style.display = 'none';
            coinToRemoveIndex = null;
        }
    });

    function removeCoinFromPortfolio(index) {
        console.log('Removing coin at index:', index);
        const coin = portfolio[index];
        totalInvestment -= coin.invested;
        totalProfit -= coin.profit;

        portfolio.splice(index, 1);
        localStorage.setItem('portfolio', JSON.stringify(portfolio));

        if (auth.currentUser) {
            saveUserData(auth.currentUser.uid);
        }

        updatePortfolioTable();
        updateTotals();
        confirmationModal.style.display = 'none';
        savePortfolioToFirebase(); // Save updates to Firebase
    }

    async function saveUserData(uid) {
        try {
            await db.collection('users').doc(uid).set({
                portfolio: portfolio,
                subscription: userSubscription
            });
            console.log('User data saved successfully!');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    function updateTotals() {
        totalInvestment = portfolio.reduce((sum, coin) => sum + coin.current, 0); // Current balance
        totalProfit = portfolio.reduce((sum, coin) => sum + coin.profit, 0);
        totalInvestmentEl.textContent = `$${formatNumberWithCommas(totalInvestment.toFixed(2))}`;

        const formattedTotalProfit = totalProfit < 0 
            ? `-$${formatNumberWithCommas(Math.abs(totalProfit).toFixed(2))}` 
            : `+$${formatNumberWithCommas(totalProfit.toFixed(2))}`;
        totalProfitEl.textContent = formattedTotalProfit;

        const totalPercentage = totalInvestment ? (totalProfit / totalInvestment * 100).toFixed(2) : 0;
        totalPercentageEl.textContent = `${totalPercentage}%`;
        totalProfitEl.className = totalProfit >= 0 ? 'profit-positive' : 'profit-negative';
        totalPercentageEl.className = totalProfit >= 0 ? 'profit-positive' : 'profit-negative';

        baseCaseBalance = portfolio.reduce((sum, coin) => sum + coin.baseCaseBalance, 0);
        moonCaseBalance = portfolio.reduce((sum, coin) => sum + coin.moonCaseBalance, 0);
        baseCaseBalanceEl.textContent = formatNumberWithCommas(baseCaseBalance.toFixed(2));
        moonCaseBalanceEl.textContent = formatNumberWithCommas(moonCaseBalance.toFixed(2));
    }

    async function updateCurrentPrices() {
        for (const coin of portfolio) {
            try {
                const { currentPrice, marketCap, circulatingSupply } = await fetchCurrentPriceAndMarketCap(coin.id);
                const currentValue = coin.coinsBought * currentPrice;
                const profit = currentValue - coin.invested;
                coin.current = currentValue;
                coin.profit = profit;
                coin.currentPrice = currentPrice;
                coin.marketCap = marketCap;

                const today = new Date().toISOString().split('T')[0];
                const history = coin.history.find(entry => entry.date === today);
                if (!history) {
                    coin.history.push({
                        date: today,
                        price: currentPrice
                    });
                }
            } catch (error) {
                console.error(`Error updating current price or market cap: ${error.message}`);
            }
        }

        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        updatePortfolioTable();
        updateTotals();

        if (auth.currentUser) {
            await saveUserData(auth.currentUser.uid);
        }
    }

    setInterval(updateCurrentPrices, 60000); // 60000ms = 1 minute
    updateCurrentPrices();

    const storedPortfolio = localStorage.getItem('portfolio');
    if (storedPortfolio) {
        portfolio = JSON.parse(storedPortfolio);
        updatePortfolioTable();
        updateTotals();
    }

    function updateAuthUI(isSignedIn) {
        if (isSignedIn) {
            signInModalButton.style.display = 'none';
            signUpModalButton.style.display = 'none';
            signOutButton.style.display = 'inline-block';
            userContainer.style.display = 'block';
            checkoutButton.style.display = userSubscription === 'free' ? 'inline-block' : 'none';
            if (feedbackEmailInput) {
                feedbackEmailInput.value = auth.currentUser.email;
            }
        } else {
            signInModalButton.style.display = 'inline-block';
            signUpModalButton.style.display = 'inline-block';
            signOutButton.style.display = 'none';
            userContainer.style.display = 'none';
            checkoutButton.style.display = 'none';
            clearLocalStorage();
            if (feedbackEmailInput) {
                feedbackEmailInput.value = '';
            }
        }
    }
});

async function createUserDocumentIfNotExists(uid, email) {
    try {
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({
                email: email,
                portfolio: [],
                subscription: 'free'
            });
            console.log('User document created successfully!');
        } else {
            console.log('Document already exists for user.');
        }
    } catch (error) {
        console.error('Error checking or creating user document:', error);
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified) {
            console.log('User is signed in and verified');
            userEmail.textContent = user.email;
            authContainer.style.display = 'none';
            userContainer.style.display = 'block';
            emailVerificationContainer.style.display = 'none';
            createUserDocumentIfNotExists(user.uid, user.email).then(() => {
                loadUserData(user.uid).then(() => {
                    updateAuthUI(true);
                });
            });
            closeModal();
        } else {
            console.log('User is signed in but not verified');
            showEmailVerificationScreen();
        }
    } else {
        console.log('No user is signed in');
        updateAuthUI(false);
        authContainer.style.display = 'block';
        userContainer.style.display = 'none';
        emailVerificationContainer.style.display = 'none';
        clearLocalStorage();
    }
});

const refreshButton = document.getElementById('refreshButton');
if (refreshButton) {
    refreshButton.addEventListener('click', function() {
        auth.currentUser.reload().then(() => {
            if (auth.currentUser.emailVerified) {
                console.log('Email verified after refresh');
                authContainer.style.display = 'none';
                emailVerificationContainer.style.display = 'none';
                userContainer.style.display = 'block';
                userEmail.textContent = auth.currentUser.email;
                loadUserData(auth.currentUser.uid).then(() => {
                    updateAuthUI(true);
                });
            } else {
                console.log('Email not verified after refresh');
            }
        }).catch(error => {
            console.error('Error reloading user:', error);
        });
    });
}


document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        attachEventListeners();
    }
});
