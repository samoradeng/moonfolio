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
   // const emailVerificationContainer = document.getElementById("emailVerificationContainer");
    const emailVerificationModal = document.getElementById("emailVerificationModal");
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
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const userMenuContainer = document.getElementById('userMenuContainer');
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
    let signUpButtonClicked = false;

    function closeModal() {
        authModal.style.display = 'none';
    }

    

    // function showEmailVerificationScreen() {
    //     const authContainer = document.getElementById('authContainer');
    //     const emailVerificationContainer = document.getElementById('emailVerificationContainer');
    //     if (authContainer && emailVerificationContainer) {
    //         authContainer.style.display = 'none';
    //         emailVerificationContainer.style.display = 'block';
    //     }
    // }

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
        signUpButton.addEventListener('click', signUp);
    }

    if (resendVerificationButton) {
        resendVerificationButton.addEventListener('click', function() {
            const user = auth.currentUser;
            if (user) {
                
                user.sendEmailVerification().then(() => {
                    console.log('Verification email sent.');
                    resendVerificationMessage.textContent = 'Verification email sent.';
                    resendVerificationMessage.style.display = 'block';
                }).catch(error => {
                    console.error('Error sending verification email:', error.message);
                    resendVerificationMessage.textContent = 'Error sending verification email. Please try again later.';
                    resendVerificationMessage.style.display = 'block';
                });
            } else {
                console.log('No user is signed in to resend verification email.');
                resendVerificationMessage.textContent = 'No user is signed in. Please sign in to resend verification email.';
                resendVerificationMessage.style.display = 'block';
            }
        });
    }

    // Ensure showEmailVerificationModal is defined
function showEmailVerificationModal() {
    emailVerificationModal.style.display = 'block';
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
                        //userContainer.style.display = 'block';
                        emailVerificationModal.style.display = 'none'; // Hide the verification message upon successful sign-in
                        createUserDocumentIfNotExists(userCredential.user.uid, email).then(() => {
                            loadUserData(userCredential.user.uid);
                        });
                        closeModal();
                        updateAuthUI(true);
                    } else {
                        auth.signOut();
                        errorMessage.textContent = 'Please verify your email address before signing in.';
                        showEmailVerificationModal();
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
                emailVerificationModal.style.display = 'none';
                clearLocalStorage();
            }).catch(error => {
                console.error('Error signing out:', error.message);
            });
        });
    }

    // Toggle dropdown menu
    userIcon.addEventListener('click', function() {
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!userMenuContainer.contains(event.target)) {
            userDropdown.style.display = 'none';
        }
    });
    

    auth.onAuthStateChanged(user => {
        if (user) {
            user.reload().then(() => {
                if (user.emailVerified) {
                    console.log('User is signed in and verified');
                    userEmail.textContent = user.email;
                    authContainer.style.display = 'none';
                    //userContainer.style.display = 'block';
                    emailVerificationModal.style.display = 'none';
                    createUserDocumentIfNotExists(user.uid, user.email).then(() => {
                        loadUserData(user.uid).then(() => {
                            updateAuthUI(true);
                        });
                    });
                    closeModal();
                } else {
                    console.log('User is signed in but not verified');
                    showEmailVerificationModal();
                    updateAuthUI(false); // Ensure UI is updated to reflect the unverified state
                }
            }).catch(error => {
                console.error('Error reloading user:', error);
            });
        } else {
            console.log('No user is signed in');
            updateAuthUI(false);
            authContainer.style.display = 'block';
            userContainer.style.display = 'none';
            emailVerificationModal.style.display = 'none';
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

            if (userSubscription === 'free' && portfolio.length >= 3) {
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

        // if (resendVerificationButton) {
        //     resendVerificationButton.addEventListener('click', function() {
        //         const user = auth.currentUser;
        //         if (user) {
                    
        //             user.sendEmailVerification().then(() => {
        //                 console.log('Verification email sent.');
        //                 resendVerificationMessage.textContent = 'Verification email sent.';
        //                 resendVerificationMessage.style.display = 'block';
        //             }).catch(error => {
        //                 console.error('Error sending verification email:', error.message);
        //                 resendVerificationMessage.textContent = 'Error sending verification email. Please try again later.';
        //                 resendVerificationMessage.style.display = 'block';
        //             });
        //         } else {
        //             console.log('No user is signed in to resend verification email.');
        //             resendVerificationMessage.textContent = 'No user is signed in. Please sign in to resend verification email.';
        //             resendVerificationMessage.style.display = 'block';
        //         }
        //     });
        // }

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
                    //userContainer.style.display = 'block';
                    emailVerificationModal.style.display = 'none';
                    createUserDocumentIfNotExists(userCredential.user.uid, email).then(() => {
                        loadUserData(userCredential.user.uid).then(() => {
                            updateAuthUI(true);
                        });
                    });
                    closeModal();
                } else {
                    auth.signOut();
                    errorMessage.textContent = 'Please verify your email address before signing in.';
                    showEmailVerificationModal();
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
                        showEmailVerificationModal();
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
            emailVerificationModal.style.display = 'none';
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
            userMenuContainer.style.display = 'inline-block';
            checkoutButton.style.display = userSubscription === 'free' ? 'block' : 'none';
            signOutButton.style.display = 'block';
            if (feedbackEmailInput) {
                feedbackEmailInput.value = auth.currentUser.email;
            }
        } else {
            signInModalButton.style.display = 'inline-block';
            signUpModalButton.style.display = 'inline-block';
            userMenuContainer.style.display = 'none';
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
        user.reload().then(() => {
            if (user.emailVerified) {
                console.log('User is signed in and verified');
                userEmail.textContent = user.email;
                authContainer.style.display = 'none';
                //userContainer.style.display = 'block';
                emailVerificationModal.style.display = 'none';
                createUserDocumentIfNotExists(user.uid, user.email).then(() => {
                    loadUserData(user.uid).then(() => {
                        updateAuthUI(true);
                    });
                });
                closeModal();
            } else {
                console.log('User is signed in but not verified');
                emailVerificationModal.style.display = 'block'; // Ensure this is correctly called
            }
        }).catch(error => {
            console.error('Error reloading user:', error);
        });
    } else {
        console.log('No user is signed in');
        //updateAuthUI(false);
        authContainer.style.display = 'block';
        userContainer.style.display = 'none';
        emailVerificationModal.style.display = 'none';
        clearLocalStorage();
    }
});



if (closeEmailVerificationModal) {
    closeEmailVerificationModal.addEventListener('click', function() {
        emailVerificationModal.style.display = 'none';
    });
}

window.addEventListener('click', function(event) {
    if (event.target == emailVerificationModal) {
        emailVerificationModal.style.display = 'none';
    }
});

const refreshButton = document.getElementById('refreshButton');
if (refreshButton) {
    refreshButton.addEventListener('click', function() {
        auth.currentUser.reload().then(() => {
            if (auth.currentUser.emailVerified) {
                console.log('Email verified after refresh');
                authContainer.style.display = 'none';
                emailVerificationModal.style.display = 'none';
                emailVerificationModal.style.display = 'none';
                //userContainer.style.display = 'block';
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

// =============================================================================
// WALLET CONNECTION & EXCHANGE INTEGRATION
// =============================================================================

class WalletManager {
    constructor() {
        this.connectedWallets = [];
        this.connectedExchanges = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadConnectedWallets();
        this.loadConnectedExchanges();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Wallet Modal
        document.getElementById('connectWalletButton')?.addEventListener('click', () => this.openWalletModal());
        document.getElementById('closeWalletModal')?.addEventListener('click', () => this.closeWalletModal());
        
        // Exchange Modal
        document.getElementById('exchangeIntegrationButton')?.addEventListener('click', () => this.openExchangeModal());
        document.getElementById('closeExchangeModal')?.addEventListener('click', () => this.closeExchangeModal());
        
        // Wallet connections
        document.getElementById('connectMetamask')?.addEventListener('click', () => this.connectMetaMask());
        document.getElementById('connectPhantom')?.addEventListener('click', () => this.connectPhantom());
        document.getElementById('connectWalletConnect')?.addEventListener('click', () => this.connectWalletConnect());
        
        // Exchange connections
        document.getElementById('connectCoinbase')?.addEventListener('click', () => this.showExchangeForm('coinbase'));
        document.getElementById('connectBinance')?.addEventListener('click', () => this.showExchangeForm('binance'));
        document.getElementById('connectKraken')?.addEventListener('click', () => this.showExchangeForm('kraken'));
        document.getElementById('saveExchangeConnection')?.addEventListener('click', () => this.saveExchangeConnection());
    }

    openWalletModal() {
        document.getElementById('walletModal').style.display = 'block';
        this.updateWalletDisplay();
    }

    closeWalletModal() {
        document.getElementById('walletModal').style.display = 'none';
    }

    openExchangeModal() {
        document.getElementById('exchangeModal').style.display = 'block';
        this.updateExchangeDisplay();
    }

    closeExchangeModal() {
        document.getElementById('exchangeModal').style.display = 'none';
    }

    async connectMetaMask() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                this.showStatus('Connecting to MetaMask...', 'info');
                
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                
                const wallet = {
                    type: 'metamask',
                    address: accounts[0],
                    chainId: chainId,
                    name: 'MetaMask',
                    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
                };
                
                this.addConnectedWallet(wallet);
                this.showStatus('MetaMask connected successfully!', 'success');
                await this.syncWalletBalance(wallet);
                
            } else {
                this.showStatus('MetaMask not found. Please install MetaMask extension.', 'error');
            }
        } catch (error) {
            this.showStatus('Failed to connect MetaMask: ' + error.message, 'error');
        }
    }

    async connectPhantom() {
        try {
            if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
                this.showStatus('Connecting to Phantom...', 'info');
                
                const response = await window.solana.connect();
                
                const wallet = {
                    type: 'phantom',
                    address: response.publicKey.toString(),
                    name: 'Phantom',
                    icon: 'https://phantom.app/img/phantom-icon-purple.png'
                };
                
                this.addConnectedWallet(wallet);
                this.showStatus('Phantom connected successfully!', 'success');
                await this.syncWalletBalance(wallet);
                
            } else {
                this.showStatus('Phantom not found. Please install Phantom wallet.', 'error');
            }
        } catch (error) {
            this.showStatus('Failed to connect Phantom: ' + error.message, 'error');
        }
    }

    async connectWalletConnect() {
        // WalletConnect integration would require additional setup
        this.showStatus('WalletConnect integration coming soon!', 'info');
    }

    addConnectedWallet(wallet) {
        const existingIndex = this.connectedWallets.findIndex(w => w.address === wallet.address);
        if (existingIndex === -1) {
            this.connectedWallets.push(wallet);
            this.saveConnectedWallets();
            this.updateWalletDisplay();
        }
    }

    removeConnectedWallet(address) {
        this.connectedWallets = this.connectedWallets.filter(w => w.address !== address);
        this.saveConnectedWallets();
        this.updateWalletDisplay();
    }

    async syncWalletBalance(wallet) {
        try {
            if (wallet.type === 'metamask') {
                await this.syncEthereumWallet(wallet);
            } else if (wallet.type === 'phantom') {
                await this.syncSolanaWallet(wallet);
            }
        } catch (error) {
            console.error('Error syncing wallet balance:', error);
        }
    }

    async syncEthereumWallet(wallet) {
        try {
            // Get ETH balance
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [wallet.address, 'latest']
            });
            
            const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
            
            if (ethBalance > 0) {
                const ethPrice = await this.getCoinPrice('ethereum');
                const ethValue = ethBalance * ethPrice;
                
                await this.addWalletHolding({
                    coinId: 'ethereum',
                    coinName: 'Ethereum',
                    symbol: 'ETH',
                    amount: ethBalance,
                    value: ethValue,
                    walletAddress: wallet.address,
                    walletType: wallet.type
                });
            }

            // Get ERC-20 token balances (simplified - would need token contract addresses)
            await this.syncERC20Tokens(wallet.address);
            
        } catch (error) {
            console.error('Error syncing Ethereum wallet:', error);
        }
    }

    async syncSolanaWallet(wallet) {
        try {
            // Get SOL balance
            const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
            const publicKey = new solanaWeb3.PublicKey(wallet.address);
            const balance = await connection.getBalance(publicKey);
            const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
            
            if (solBalance > 0) {
                const solPrice = await this.getCoinPrice('solana');
                const solValue = solBalance * solPrice;
                
                await this.addWalletHolding({
                    coinId: 'solana',
                    coinName: 'Solana',
                    symbol: 'SOL',
                    amount: solBalance,
                    value: solValue,
                    walletAddress: wallet.address,
                    walletType: wallet.type
                });
            }
            
        } catch (error) {
            console.error('Error syncing Solana wallet:', error);
        }
    }

    async addWalletHolding(holding) {
        // Check if this holding already exists in portfolio
        const existingCoin = portfolio.find(coin => 
            coin.id === holding.coinId && 
            coin.walletAddress === holding.walletAddress
        );

        if (!existingCoin && holding.value > 1) { // Only add if value > $1
            const coin = {
                id: holding.coinId,
                name: holding.coinName,
                symbol: holding.symbol,
                invested: holding.value,
                current: holding.value,
                profit: 0,
                coinsBought: holding.amount,
                currentPrice: holding.value / holding.amount,
                date: new Date().toISOString().split('T')[0],
                baseCaseROI: 2,
                moonCaseROI: 10,
                walletAddress: holding.walletAddress,
                walletType: holding.walletType,
                autoImported: true,
                history: [{
                    date: new Date().toISOString().split('T')[0],
                    price: holding.value / holding.amount,
                    value: holding.value
                }]
            };

            portfolio.push(coin);
            await savePortfolioToFirebase();
            updatePortfolioTable();
            updateTotals();
            
            this.showNotification('success', 'Wallet Sync', 
                `Added ${holding.coinName} (${holding.amount.toFixed(4)} ${holding.symbol}) from ${holding.walletType}`);
        }
    }

    async getCoinPrice(coinId) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
            const data = await response.json();
            return data[coinId]?.usd || 0;
        } catch (error) {
            console.error('Error fetching coin price:', error);
            return 0;
        }
    }

    showExchangeForm(exchange) {
        document.getElementById('exchangeApiForm').style.display = 'block';
        document.getElementById('selectedExchangeName').textContent = exchange.charAt(0).toUpperCase() + exchange.slice(1);
        document.getElementById('exchangeApiForm').dataset.exchange = exchange;
    }

    async saveExchangeConnection() {
        const exchange = document.getElementById('exchangeApiForm').dataset.exchange;
        const apiKey = document.getElementById('apiKey').value;
        const apiSecret = document.getElementById('apiSecret').value;
        const apiPassphrase = document.getElementById('apiPassphrase').value;

        if (!apiKey || !apiSecret) {
            this.showStatus('Please fill in all required fields', 'error');
            return;
        }

        const exchangeConnection = {
            exchange: exchange,
            apiKey: this.encryptApiKey(apiKey), // In production, encrypt these
            apiSecret: this.encryptApiKey(apiSecret),
            apiPassphrase: apiPassphrase ? this.encryptApiKey(apiPassphrase) : null,
            connected: true,
            lastSync: new Date().toISOString()
        };

        // Test the connection
        try {
            await this.testExchangeConnection(exchangeConnection);
            this.connectedExchanges.push(exchangeConnection);
            this.saveConnectedExchanges();
            this.updateExchangeDisplay();
            this.showStatus('Exchange connected successfully!', 'success');
            
            // Start syncing exchange data
            await this.syncExchangePortfolio(exchangeConnection);
            
        } catch (error) {
            this.showStatus('Failed to connect exchange: ' + error.message, 'error');
        }

        // Clear form
        document.getElementById('apiKey').value = '';
        document.getElementById('apiSecret').value = '';
        document.getElementById('apiPassphrase').value = '';
        document.getElementById('exchangeApiForm').style.display = 'none';
    }

    async testExchangeConnection(connection) {
        // Simplified connection test - in production, implement proper API calls
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
        });
    }

    async syncExchangePortfolio(connection) {
        // Simplified sync - in production, implement proper exchange API calls
        this.showNotification('info', 'Exchange Sync', 
            `Starting portfolio sync from ${connection.exchange}...`);
    }

    encryptApiKey(key) {
        // Simplified encryption - in production, use proper encryption
        return btoa(key);
    }

    updateWalletDisplay() {
        const container = document.getElementById('connectedWallets');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.connectedWallets.length === 0) {
            container.innerHTML = '<p style="color: #6b7280; text-align: center;">No wallets connected</p>';
            return;
        }

        this.connectedWallets.forEach(wallet => {
            const item = document.createElement('div');
            item.className = 'connected-item';
            item.innerHTML = `
                <div class="info">
                    <img src="${wallet.icon}" alt="${wallet.name}">
                    <div>
                        <div style="font-weight: 500;">${wallet.name}</div>
                        <div style="font-size: 12px; color: #6b7280;">${this.truncateAddress(wallet.address)}</div>
                    </div>
                </div>
                <button class="disconnect-btn" onclick="walletManager.removeConnectedWallet('${wallet.address}')">
                    Disconnect
                </button>
            `;
            container.appendChild(item);
        });
    }

    updateExchangeDisplay() {
        const container = document.getElementById('connectedExchanges');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.connectedExchanges.length === 0) {
            container.innerHTML = '<p style="color: #6b7280; text-align: center;">No exchanges connected</p>';
            return;
        }

        this.connectedExchanges.forEach((exchange, index) => {
            const item = document.createElement('div');
            item.className = 'connected-item';
            item.innerHTML = `
                <div class="info">
                    <div>
                        <div style="font-weight: 500;">${exchange.exchange.charAt(0).toUpperCase() + exchange.exchange.slice(1)}</div>
                        <div style="font-size: 12px; color: #6b7280;">Last sync: ${new Date(exchange.lastSync).toLocaleDateString()}</div>
                    </div>
                </div>
                <button class="disconnect-btn" onclick="walletManager.removeExchange(${index})">
                    Disconnect
                </button>
            `;
            container.appendChild(item);
        });
    }

    removeExchange(index) {
        this.connectedExchanges.splice(index, 1);
        this.saveConnectedExchanges();
        this.updateExchangeDisplay();
    }

    truncateAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('walletStatus');
        if (!statusEl) return;

        statusEl.textContent = message;
        statusEl.className = `wallet-status ${type}`;
    }

    saveConnectedWallets() {
        localStorage.setItem('connectedWallets', JSON.stringify(this.connectedWallets));
        if (auth.currentUser) {
            this.saveWalletDataToFirebase();
        }
    }

    saveConnectedExchanges() {
        localStorage.setItem('connectedExchanges', JSON.stringify(this.connectedExchanges));
        if (auth.currentUser) {
            this.saveExchangeDataToFirebase();
        }
    }

    loadConnectedWallets() {
        const saved = localStorage.getItem('connectedWallets');
        if (saved) {
            this.connectedWallets = JSON.parse(saved);
        }
    }

    loadConnectedExchanges() {
        const saved = localStorage.getItem('connectedExchanges');
        if (saved) {
            this.connectedExchanges = JSON.parse(saved);
        }
    }

    async saveWalletDataToFirebase() {
        if (!auth.currentUser) return;
        
        try {
            await db.collection('users').doc(auth.currentUser.uid).set({
                connectedWallets: this.connectedWallets
            }, { merge: true });
        } catch (error) {
            console.error('Error saving wallet data to Firebase:', error);
        }
    }

    async saveExchangeDataToFirebase() {
        if (!auth.currentUser) return;
        
        try {
            await db.collection('users').doc(auth.currentUser.uid).set({
                connectedExchanges: this.connectedExchanges
            }, { merge: true });
        } catch (error) {
            console.error('Error saving exchange data to Firebase:', error);
        }
    }

    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// =============================================================================
// ADVANCED ALERTS SYSTEM
// =============================================================================

class AlertsManager {
    constructor() {
        this.alerts = [];
        this.isInitialized = false;
        this.checkInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAlerts();
        this.startAlertChecking();
        this.setupAlertCoinAutocomplete();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Alerts Modal
        document.getElementById('alertsButton')?.addEventListener('click', () => this.openAlertsModal());
        document.getElementById('closeAlertsModal')?.addEventListener('click', () => this.closeAlertsModal());
        
        // Alert Tabs
        document.getElementById('priceAlertsTab')?.addEventListener('click', () => this.switchTab('price'));
        document.getElementById('portfolioAlertsTab')?.addEventListener('click', () => this.switchTab('portfolio'));
        document.getElementById('marketAlertsTab')?.addEventListener('click', () => this.switchTab('market'));
        
        // Create Alert Buttons
        document.getElementById('createPriceAlert')?.addEventListener('click', () => this.createPriceAlert());
        document.getElementById('createPortfolioAlert')?.addEventListener('click', () => this.createPortfolioAlert());
        document.getElementById('createMarketAlert')?.addEventListener('click', () => this.createMarketAlert());
    }

    openAlertsModal() {
        document.getElementById('alertsModal').style.display = 'block';
        this.updateAllAlertDisplays();
    }

    closeAlertsModal() {
        document.getElementById('alertsModal').style.display = 'none';
    }

    switchTab(tab) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.alert-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.alert-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.getElementById(`${tab}AlertsTab`).classList.add('active');
        document.getElementById(`${tab}AlertsContent`).classList.add('active');
    }

    setupAlertCoinAutocomplete() {
        const alertCoinInput = $('#alertCoin');
        if (alertCoinInput.length && coinData.length > 0) {
            alertCoinInput.autocomplete({
                source: coinData,
                minLength: 2,
                select: function(event, ui) {
                    alertCoinInput.data('coin-id', ui.item.id);
                }
            }).autocomplete("instance")._renderItem = function(ul, item) {
                return $("<li>")
                    .append(`<div><img src="${item.image}" class="coin-select-icon"> ${item.label}</div>`)
                    .appendTo(ul);
            };
        }
    }

    createPriceAlert() {
        const coinId = $('#alertCoin').data('coin-id');
        const coinName = document.getElementById('alertCoin').value;
        const alertType = document.getElementById('alertType').value;
        const alertValue = parseFloat(document.getElementById('alertValue').value);
        const frequency = document.getElementById('alertFrequency').value;

        if (!coinId || !alertValue) {
            this.showNotification('error', 'Invalid Alert', 'Please select a coin and enter a valid value');
            return;
        }

        const alert = {
            id: this.generateAlertId(),
            type: 'price',
            coinId: coinId,
            coinName: coinName,
            alertType: alertType,
            targetValue: alertValue,
            frequency: frequency,
            active: true,
            created: new Date().toISOString(),
            lastTriggered: null,
            triggerCount: 0
        };

        this.alerts.push(alert);
        this.saveAlerts();
        this.updatePriceAlertsDisplay();
        this.clearPriceAlertForm();
        
        this.showNotification('success', 'Alert Created', 
            `Price alert for ${coinName} has been created`);
    }

    createPortfolioAlert() {
        const alertType = document.getElementById('portfolioAlertType').value;
        const alertValue = parseFloat(document.getElementById('portfolioAlertValue').value);

        if (!alertValue) {
            this.showNotification('error', 'Invalid Alert', 'Please enter a valid threshold value');
            return;
        }

        const alert = {
            id: this.generateAlertId(),
            type: 'portfolio',
            alertType: alertType,
            targetValue: alertValue,
            active: true,
            created: new Date().toISOString(),
            lastTriggered: null,
            triggerCount: 0
        };

        this.alerts.push(alert);
        this.saveAlerts();
        this.updatePortfolioAlertsDisplay();
        this.clearPortfolioAlertForm();
        
        this.showNotification('success', 'Alert Created', 
            `Portfolio alert for ${alertType} has been created`);
    }

    createMarketAlert() {
        const alertType = document.getElementById('marketAlertType').value;
        const alertValue = parseFloat(document.getElementById('marketAlertValue').value);

        if (!alertValue) {
            this.showNotification('error', 'Invalid Alert', 'Please enter a valid threshold value');
            return;
        }

        const alert = {
            id: this.generateAlertId(),
            type: 'market',
            alertType: alertType,
            targetValue: alertValue,
            active: true,
            created: new Date().toISOString(),
            lastTriggered: null,
            triggerCount: 0
        };

        this.alerts.push(alert);
        this.saveAlerts();
        this.updateMarketAlertsDisplay();
        this.clearMarketAlertForm();
        
        this.showNotification('success', 'Alert Created', 
            `Market alert for ${alertType} has been created`);
    }

    async startAlertChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check alerts every 2 minutes
        this.checkInterval = setInterval(() => {
            this.checkAllAlerts();
        }, 120000);

        // Initial check
        this.checkAllAlerts();
    }

    async checkAllAlerts() {
        if (!this.alerts.length) return;

        for (const alert of this.alerts.filter(a => a.active)) {
            try {
                if (alert.type === 'price') {
                    await this.checkPriceAlert(alert);
                } else if (alert.type === 'portfolio') {
                    await this.checkPortfolioAlert(alert);
                } else if (alert.type === 'market') {
                    await this.checkMarketAlert(alert);
                }
            } catch (error) {
                console.error('Error checking alert:', error);
            }
        }
    }

    async checkPriceAlert(alert) {
        try {
            const currentPrice = await this.getCoinPrice(alert.coinId);
            let triggered = false;
            let message = '';

            switch (alert.alertType) {
                case 'price_above':
                    if (currentPrice >= alert.targetValue) {
                        triggered = true;
                        message = `${alert.coinName} price ($${currentPrice.toFixed(2)}) is above your target of $${alert.targetValue}`;
                    }
                    break;
                case 'price_below':
                    if (currentPrice <= alert.targetValue) {
                        triggered = true;
                        message = `${alert.coinName} price ($${currentPrice.toFixed(2)}) is below your target of $${alert.targetValue}`;
                    }
                    break;
                case 'price_change':
                    const priceChange = await this.getCoinPriceChange24h(alert.coinId);
                    if (Math.abs(priceChange) >= alert.targetValue) {
                        triggered = true;
                        message = `${alert.coinName} has changed ${priceChange.toFixed(2)}% in 24h (target: ${alert.targetValue}%)`;
                    }
                    break;
            }

            if (triggered && this.shouldTriggerAlert(alert)) {
                this.triggerAlert(alert, message);
            }
        } catch (error) {
            console.error('Error checking price alert:', error);
        }
    }

    async checkPortfolioAlert(alert) {
        if (!portfolio.length) return;

        let triggered = false;
        let message = '';

        switch (alert.alertType) {
            case 'total_gain':
                const totalPercentage = totalInvestment ? (totalProfit / totalInvestment * 100) : 0;
                if (Math.abs(totalPercentage) >= alert.targetValue) {
                    triggered = true;
                    message = `Portfolio ${totalPercentage >= 0 ? 'gain' : 'loss'}: ${Math.abs(totalPercentage).toFixed(2)}% (target: ${alert.targetValue}%)`;
                }
                break;
            case 'daily_change':
                const dailyChange = await this.calculateDailyPortfolioChange();
                if (Math.abs(dailyChange) >= alert.targetValue) {
                    triggered = true;
                    message = `Portfolio daily change: ${dailyChange.toFixed(2)}% (target: ${alert.targetValue}%)`;
                }
                break;
            case 'rebalance_needed':
                const needsRebalancing = this.checkRebalancingNeeded();
                if (needsRebalancing) {
                    triggered = true;
                    message = 'Portfolio rebalancing recommended based on allocation drift';
                }
                break;
        }

        if (triggered && this.shouldTriggerAlert(alert)) {
            this.triggerAlert(alert, message);
        }
    }

    async checkMarketAlert(alert) {
        let triggered = false;
        let message = '';

        switch (alert.alertType) {
            case 'fear_greed':
                const fearGreedIndex = await this.getFearGreedIndex();
                if (fearGreedIndex <= alert.targetValue) {
                    triggered = true;
                    message = `Fear & Greed Index: ${fearGreedIndex} (target: ${alert.targetValue})`;
                }
                break;
            case 'btc_dominance':
                const btcDominance = await this.getBitcoinDominance();
                if (btcDominance <= alert.targetValue) {
                    triggered = true;
                    message = `Bitcoin Dominance: ${btcDominance}% (target: ${alert.targetValue}%)`;
                }
                break;
        }

        if (triggered && this.shouldTriggerAlert(alert)) {
            this.triggerAlert(alert, message);
        }
    }

    shouldTriggerAlert(alert) {
        const now = new Date();
        
        if (alert.frequency === 'once' && alert.triggerCount > 0) {
            return false;
        }
        
        if (alert.frequency === 'daily' && alert.lastTriggered) {
            const lastTrigger = new Date(alert.lastTriggered);
            const hoursSinceLastTrigger = (now - lastTrigger) / (1000 * 60 * 60);
            if (hoursSinceLastTrigger < 24) {
                return false;
            }
        }
        
        return true;
    }

    triggerAlert(alert, message) {
        alert.lastTriggered = new Date().toISOString();
        alert.triggerCount++;
        
        if (alert.frequency === 'once') {
            alert.active = false;
        }
        
        this.saveAlerts();
        this.showNotification('warning', 'Alert Triggered!', message);
        
        // Update displays
        this.updateAllAlertDisplays();
    }

    // Helper methods for data fetching
    async getCoinPrice(coinId) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
            const data = await response.json();
            return data[coinId]?.usd || 0;
        } catch (error) {
            console.error('Error fetching coin price:', error);
            return 0;
        }
    }

    async getCoinPriceChange24h(coinId) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();
            return data[coinId]?.usd_24h_change || 0;
        } catch (error) {
            console.error('Error fetching price change:', error);
            return 0;
        }
    }

    async getFearGreedIndex() {
        try {
            const response = await fetch('https://api.alternative.me/fng/');
            const data = await response.json();
            return parseInt(data.data[0].value);
        } catch (error) {
            console.error('Error fetching Fear & Greed index:', error);
            return 50; // Neutral
        }
    }

    async getBitcoinDominance() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            const data = await response.json();
            return data.data.market_cap_percentage.btc || 0;
        } catch (error) {
            console.error('Error fetching Bitcoin dominance:', error);
            return 0;
        }
    }

    async calculateDailyPortfolioChange() {
        // Simplified calculation - in production, compare with yesterday's values
        const totalPercentage = totalInvestment ? (totalProfit / totalInvestment * 100) : 0;
        return totalPercentage * 0.1; // Simplified daily change estimation
    }

    checkRebalancingNeeded() {
        if (portfolio.length < 2) return false;
        
        // Simple rebalancing check - if any coin is >50% of portfolio
        const totalValue = portfolio.reduce((sum, coin) => sum + coin.current, 0);
        return portfolio.some(coin => (coin.current / totalValue) > 0.5);
    }

    // Display update methods
    updateAllAlertDisplays() {
        this.updatePriceAlertsDisplay();
        this.updatePortfolioAlertsDisplay();
        this.updateMarketAlertsDisplay();
    }

    updatePriceAlertsDisplay() {
        const container = document.getElementById('priceAlertsList');
        if (!container) return;

        const priceAlerts = this.alerts.filter(a => a.type === 'price');
        this.renderAlertsList(container, priceAlerts);
    }

    updatePortfolioAlertsDisplay() {
        const container = document.getElementById('portfolioAlertsList');
        if (!container) return;

        const portfolioAlerts = this.alerts.filter(a => a.type === 'portfolio');
        this.renderAlertsList(container, portfolioAlerts);
    }

    updateMarketAlertsDisplay() {
        const container = document.getElementById('marketAlertsList');
        if (!container) return;

        const marketAlerts = this.alerts.filter(a => a.type === 'market');
        this.renderAlertsList(container, marketAlerts);
    }

    renderAlertsList(container, alerts) {
        container.innerHTML = '';
        
        if (alerts.length === 0) {
            container.innerHTML = '<p style="color: #6b7280; text-align: center;">No alerts created</p>';
            return;
        }

        alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `alert-item ${alert.triggerCount > 0 ? 'triggered' : ''}`;
            
            const description = this.getAlertDescription(alert);
            const status = alert.active ? 'active' : (alert.triggerCount > 0 ? 'triggered' : 'inactive');
            
            item.innerHTML = `
                <div class="alert-info">
                    <h4>${description}</h4>
                    <p>Created: ${new Date(alert.created).toLocaleDateString()}</p>
                    ${alert.lastTriggered ? `<p>Last triggered: ${new Date(alert.lastTriggered).toLocaleDateString()}</p>` : ''}
                    <span class="alert-status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div class="alert-actions">
                    <button class="alert-toggle ${alert.active ? '' : 'disabled'}" 
                            onclick="alertsManager.toggleAlert('${alert.id}')">
                        ${alert.active ? 'Disable' : 'Enable'}
                    </button>
                    <button class="alert-delete" onclick="alertsManager.deleteAlert('${alert.id}')">
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    getAlertDescription(alert) {
        switch (alert.type) {
            case 'price':
                const typeDesc = {
                    'price_above': 'above',
                    'price_below': 'below',
                    'price_change': 'changes by',
                    'volume_spike': 'volume spike'
                };
                return `${alert.coinName} ${typeDesc[alert.alertType]} $${alert.targetValue}${alert.alertType === 'price_change' ? '%' : ''}`;
            
            case 'portfolio':
                return `Portfolio ${alert.alertType.replace('_', ' ')} ${alert.targetValue}%`;
            
            case 'market':
                return `${alert.alertType.replace('_', ' ')} ${alert.targetValue}`;
            
            default:
                return 'Unknown alert';
        }
    }

    toggleAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = !alert.active;
            this.saveAlerts();
            this.updateAllAlertDisplays();
        }
    }

    deleteAlert(alertId) {
        this.alerts = this.alerts.filter(a => a.id !== alertId);
        this.saveAlerts();
        this.updateAllAlertDisplays();
    }

    // Form clearing methods
    clearPriceAlertForm() {
        document.getElementById('alertCoin').value = '';
        document.getElementById('alertType').selectedIndex = 0;
        document.getElementById('alertValue').value = '';
        document.getElementById('alertFrequency').selectedIndex = 0;
        $('#alertCoin').removeData('coin-id');
    }

    clearPortfolioAlertForm() {
        document.getElementById('portfolioAlertType').selectedIndex = 0;
        document.getElementById('portfolioAlertValue').value = '';
    }

    clearMarketAlertForm() {
        document.getElementById('marketAlertType').selectedIndex = 0;
        document.getElementById('marketAlertValue').value = '';
    }

    // Utility methods
    generateAlertId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveAlerts() {
        localStorage.setItem('userAlerts', JSON.stringify(this.alerts));
        if (auth.currentUser) {
            this.saveAlertsToFirebase();
        }
    }

    loadAlerts() {
        const saved = localStorage.getItem('userAlerts');
        if (saved) {
            this.alerts = JSON.parse(saved);
        }
    }

    async saveAlertsToFirebase() {
        if (!auth.currentUser) return;
        
        try {
            await db.collection('users').doc(auth.currentUser.uid).set({
                alerts: this.alerts
            }, { merge: true });
        } catch (error) {
            console.error('Error saving alerts to Firebase:', error);
        }
    }

    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wallet and alerts managers
    window.walletManager = new WalletManager();
    window.alertsManager = new AlertsManager();
    
    console.log('Wallet and Alerts systems initialized!');
});
