// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyD6BGr1wYWAlSn_48kkEZORcUvjvfdu3gU",
    authDomain: "superearn-8b2dd.firebaseapp.com",
    projectId: "superearn-8b2dd",
    storageBucket: "superearn-8b2dd.firebasestorage.app",
    messagingSenderId: "988452699225",
    appId: "1:988452699225:web:6891ac44e48dec2a08c548",
    measurementId: "G-T0V618S9W6",
    databaseURL: "https://superearn-8b2dd-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Page load hone par sabse pehle ye chalega
document.addEventListener("DOMContentLoaded", () => {
    
    // User ID (Mobile number) localStorage se uthana
    const userId = localStorage.getItem("userId");

    // ==========================================
    // 2. REAL-TIME WALLET SYNC (Firebase to UI)
    // ==========================================
    function syncWallet() {
        if (!userId) return;
        
        database.ref('users/' + userId).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const balanceEl = document.getElementById("balanceAmount");
                const coinEl = document.getElementById("coinAmount");
                
                // UI Update karo
                if (balanceEl) balanceEl.innerText = "₹ " + (data.balance || 0).toFixed(2);
                if (coinEl) coinEl.innerText = "🪙 " + (data.coins || 0) + " Coins";
                
                // Local backup
                localStorage.setItem("walletBalance", data.balance || 0);
                localStorage.setItem("walletCoins", data.coins || 0);
            }
        });
    }

    // Agar user logged in hai, toh turant balance sync karo
    if (userId) {
        syncWallet();
    }


    // 3. FULL GLOBAL TRANSLATION DICTIONARY (12 Languages)
    // ==========================================
    const translations = {
        en: { 
            totalBalance: "Total Balance", withdrawBtn: "Withdraw", earningZones: "Earning Zones",
            dailyCheckin: "🎁 Daily Check-in", dailyCheckinDesc: "Earn ₹1 everyday",
            appTesting: "📱 App Testing", appTestingDesc: "High Payout (₹50 - ₹100)",
            socialTasks: "💬 Social Tasks", socialTasksDesc: "Watch & Comment (₹10 - ₹20)",
            megaOffers: "🔥 Mega Offers", megaOffersDesc: "CPA Offers (₹150+)",
            spinTitle: "🎡 Spin & Win", spinDesc: "Win up to 20 coins!", spinNow: "Spin Now!",
            megaOffersTitle: "Mega Offers", megaOffersSub: "Complete tasks to earn cash!",
            socialTasksTitle: "Social Tasks", socialTasksSub: "Earn with Social Media!",
            appTestingTitle: "App Testing", appTestingSub: "Test new apps for rewards!",
            
            totalBalance: "Total Balance", withdrawBtn: "Withdraw", earningZones: "Earning Zones",
            dailyCheckin: "🎁 Daily Check-in", dailyCheckinDesc: "Earn Coins everyday",
            appTesting: "📱 App Testing", appTestingDesc: "High Payout",
            socialTasks: "💬 Social Tasks", socialTasksDesc: "Watch & Comment",
            megaOffers: "🔥 Mega Offers", megaOffersDesc: "CPA Offers",
            spinTitle: "🎡 Spin & Win", spinDesc: "Win up to 20 coins!", spinNow: "Spin Now!",
            // Ye NAYE shabd hain Profile ke liye:
            profPayment: "Payment Settings", profHistory: "Transaction History", profRefer: "Refer & Earn", profSupport: "Help & Support", profLogout: "Logout"
        
        },
        hi: { 
            totalBalance: "कुल बैलेंस", withdrawBtn: "पैसे निकालें", earningZones: "कमाई के तरीके",
            dailyCheckin: "🎁 रोज़ाना चेक-इन", dailyCheckinDesc: "रोज़ ₹1 कमाएं",
            appTesting: "📱 ऐप टेस्टिंग", appTestingDesc: "बड़ी कमाई (₹50 - ₹100)",
            socialTasks: "💬 सोशल टास्क", socialTasksDesc: "देखें और कमेंट करें (₹10 - ₹20)",
            megaOffers: "🔥 मेगा ऑफर्स", megaOffersDesc: "CPA ऑफर्स (₹150+)",
            spinTitle: "🎡 स्पिन और जीतें", spinDesc: "20 कॉइन तक जीतें!", spinNow: "अभी स्पिन करें!",
            megaOffersTitle: "मेगा ऑफर्स", megaOffersSub: "नकद कमाने के लिए टास्क पूरे करें!",
            socialTasksTitle: "सोशल टास्क", socialTasksSub: "सोशल मीडिया से पैसे कमाएं!",
            appTestingTitle: "ऐप टेस्टिंग", appTestingSub: "इनाम के लिए नए ऐप्स टेस्ट करें!",
            
            totalBalance: "कुल बैलेंस", withdrawBtn: "पैसे निकालें", earningZones: "कमाई के तरीके",
            dailyCheckin: "🎁 रोज़ाना चेक-इन", dailyCheckinDesc: "रोज़ कॉइन्स कमाएं",
            appTesting: "📱 ऐप टेस्टिंग", appTestingDesc: "बड़ी कमाई",
            socialTasks: "💬 सोशल टास्क", socialTasksDesc: "देखें और कमेंट करें",
            megaOffers: "🔥 मेगा ऑफर्स", megaOffersDesc: "CPA ऑफर्स",
            spinTitle: "🎡 स्पिन और जीतें", spinDesc: "20 कॉइन तक जीतें!", spinNow: "अभी स्पिन करें!",
            // Ye NAYE shabd hain Profile ke liye:
            profPayment: "पेमेंट सेटिंग्स", profHistory: "लेनदेन का इतिहास", profRefer: "रेफर करें और कमाएं", profSupport: "मदद और सपोर्ट", profLogout: "लॉग आउट"
        
        },
        es: { totalBalance: "Saldo Total", withdrawBtn: "Retirar", earningZones: "Zonas de Ganancias", dailyCheckin: "🎁 Check-in Diario", dailyCheckinDesc: "Gana ₹1 todos los días", appTesting: "📱 Prueba de Apps", appTestingDesc: "Alto Pago (₹50 - ₹100)", socialTasks: "💬 Tareas Sociales", socialTasksDesc: "Ver y Comentar (₹10 - ₹20)", megaOffers: "🔥 Mega Ofertas", megaOffersDesc: "Ofertas CPA (₹150+)", spinTitle: "🎡 Girar y Ganar", spinDesc: "¡Gana hasta 20 monedas!", spinNow: "Girar Ahora", megaOffersTitle: "Mega Ofertas", megaOffersSub: "¡Completa tareas!", socialTasksTitle: "Tareas Sociales", socialTasksSub: "¡Gana con redes sociales!", appTestingTitle: "Prueba de Apps", appTestingSub: "¡Prueba apps!",
        totalBalance: "Saldo Total", withdrawBtn: "Retirar", earningZones: "Zonas de Ganancias",
    dailyCheckin: "🎁 Check-in Diario", dailyCheckinDesc: "Gana monedas todos los días",
    appTesting: "📱 Prueba de Apps", appTestingDesc: "Alto Pago",
    socialTasks: "💬 Tareas Sociales", socialTasksDesc: "Ver y Comentar",
    megaOffers: "🔥 Mega Ofertas", megaOffersDesc: "Ofertas CPA",
    spinTitle: "🎡 Girar y Ganar", spinDesc: "¡Gana hasta 20 monedas!", spinNow: "Girar Ahora",
    megaOffersTitle: "Mega Ofertas", megaOffersSub: "¡Completa tareas!",
    socialTasksTitle: "Tareas Sociales", socialTasksSub: "¡Gana con redes sociales!",
    appTestingTitle: "Prueba de Apps", appTestingSub: "¡Prueba apps!",
    // Profile Words
    profPayment: "Ajustes de Pago", profHistory: "Historial de Transacciones", profRefer: "Referir y Ganar", profSupport: "Ayuda y Soporte", profLogout: "Cerrar Sesión"

        },
        fr: { totalBalance: "Solde Total", withdrawBtn: "Retirer", earningZones: "Zones de Gains", dailyCheckin: "🎁 Check-in Quotidien", dailyCheckinDesc: "Gagnez ₹1 chaque jour", appTesting: "📱 Test d'Applis", appTestingDesc: "Paiement Élevé (₹50 - ₹100)", socialTasks: "💬 Tâches Sociales", socialTasksDesc: "Regarder et Commenter (₹10 - ₹20)", megaOffers: "🔥 Méga Offres", megaOffersDesc: "Offres CPA (₹150+)", spinTitle: "🎡 Tournez et Gagnez", spinDesc: "Gagnez jusqu'à 20 pièces!", spinNow: "Tourner", megaOffersTitle: "Méga Offres", megaOffersSub: "Gagnez de l'argent!", socialTasksTitle: "Tâches Sociales", socialTasksSub: "Gagnez de l'argent!", appTestingTitle: "Test d'Applis", appTestingSub: "Testez les applis!",
        totalBalance: "Solde Total", withdrawBtn: "Retirer", earningZones: "Zones de Gains",
    dailyCheckin: "🎁 Check-in Quotidien", dailyCheckinDesc: "Gagnez des pièces chaque jour",
    appTesting: "📱 Test d'Applis", appTestingDesc: "Paiement Élevé",
    socialTasks: "💬 Tâches Sociales", socialTasksDesc: "Regarder et Commenter",
    megaOffers: "🔥 Méga Offres", megaOffersDesc: "Offres CPA",
    spinTitle: "🎡 Tournez et Gagnez", spinDesc: "Gagnez jusqu'à 20 pièces!", spinNow: "Tourner",
    megaOffersTitle: "Méga Offres", megaOffersSub: "Gagnez de l'argent!",
    socialTasksTitle: "Tâches Sociales", socialTasksSub: "Gagnez de l'argent!",
    appTestingTitle: "Test d'Applis", appTestingSub: "Testez les applis!",
    // Profile Words
    profPayment: "Paramètres de Paiement", profHistory: "Historique des Transactions", profRefer: "Parrainer et Gagner", profSupport: "Aide et Support", profLogout: "Déconnexion"

        },
        de: { totalBalance: "Gesamtsaldo", withdrawBtn: "Abheben", earningZones: "Verdienstzonen", dailyCheckin: "🎁 Täglicher Check-in", dailyCheckinDesc: "Verdiene jeden Tag ₹1", appTesting: "📱 App-Tests", appTestingDesc: "Hohe Auszahlung (₹50 - ₹100)", socialTasks: "💬 Soziale Aufgaben", socialTasksDesc: "Ansehen & Kommentieren (₹10 - ₹20)", megaOffers: "🔥 Mega-Angebote", megaOffersDesc: "CPA-Angebote (₹150+)", spinTitle: "🎡 Drehen & Gewinnen", spinDesc: "Gewinne bis zu 20 Münzen!", spinNow: "Jetzt drehen", megaOffersTitle: "Mega-Angebote", megaOffersSub: "Aufgaben erledigen!", socialTasksTitle: "Soziale Aufgaben", socialTasksSub: "Geld verdienen!", appTestingTitle: "App-Tests", appTestingSub: "Apps testen!",
        totalBalance: "Gesamtsaldo", withdrawBtn: "Abheben", earningZones: "Verdienstzonen",
    dailyCheckin: "🎁 Täglicher Check-in", dailyCheckinDesc: "Verdiene jeden Tag Münzen",
    appTesting: "📱 App-Tests", appTestingDesc: "Hohe Auszahlung",
    socialTasks: "💬 Soziale Aufgaben", socialTasksDesc: "Ansehen & Kommentieren",
    megaOffers: "🔥 Mega-Angebote", megaOffersDesc: "CPA-Angebote",
    spinTitle: "🎡 Drehen & Gewinnen", spinDesc: "Gewinne bis zu 20 Münzen!", spinNow: "Jetzt drehen",
    megaOffersTitle: "Mega-Angebote", megaOffersSub: "Aufgaben erledigen!",
    socialTasksTitle: "Soziale Aufgaben", socialTasksSub: "Geld verdienen!",
    appTestingTitle: "App-Tests", appTestingSub: "Apps testen!",
    // Profile Words
    profPayment: "Zahlungseinstellungen", profHistory: "Transaktionsverlauf", profRefer: "Werben & Verdienen", profSupport: "Hilfe & Support", profLogout: "Abmelden"

        },
        zh: { totalBalance: "总余额", withdrawBtn: "提款", earningZones: "赚钱区", dailyCheckin: "🎁 每日签到", dailyCheckinDesc: "每天赚取 ₹1", appTesting: "📱 应用测试", appTestingDesc: "高额回报 (₹50 - ₹100)", socialTasks: "💬 社交任务", socialTasksDesc: "观看并评论 (₹10 - ₹20)", megaOffers: "🔥 超级优惠", megaOffersDesc: "CPA 优惠 (₹150+)", spinTitle: "🎡 旋转赢奖", spinDesc: "赢取高达20个金币！", spinNow: "立即旋转", megaOffersTitle: "超级优惠", megaOffersSub: "完成任务赚取现金！", socialTasksTitle: "社交任务", socialTasksSub: "社交媒体赚钱！", appTestingTitle: "应用测试", appTestingSub: "测试应用！",
        totalBalance: "总余额", withdrawBtn: "提款", earningZones: "赚钱区",
    dailyCheckin: "🎁 每日签到", dailyCheckinDesc: "每天赚取金币",
    appTesting: "📱 应用测试", appTestingDesc: "高额回报",
    socialTasks: "💬 社交任务", socialTasksDesc: "观看并评论",
    megaOffers: "🔥 超级优惠", megaOffersDesc: "CPA 优惠",
    spinTitle: "🎡 旋转赢奖", spinDesc: "赢取高达20个金币！", spinNow: "立即旋转",
    megaOffersTitle: "超级优惠", megaOffersSub: "完成任务赚取现金！",
    socialTasksTitle: "社交任务", socialTasksSub: "社交媒体赚钱！",
    appTestingTitle: "应用测试", appTestingSub: "测试应用！",
    // Profile Words
    profPayment: "支付设置", profHistory: "交易记录", profRefer: "邀请赚钱", profSupport: "帮助与支持", profLogout: "登出"

        },
        ar: { totalBalance: "إجمالي الرصيد", withdrawBtn: "سحب", earningZones: "مناطق الكسب", dailyCheckin: "🎁 تسجيل الدخول اليومي", dailyCheckinDesc: "اربح ₹1 كل يوم", appTesting: "📱 اختبار التطبيقات", appTestingDesc: "عائد مرتفع (₹50 - ₹100)", socialTasks: "💬 المهام الاجتماعية", socialTasksDesc: "شاهد وعلق (₹10 - ₹20)", megaOffers: "🔥 عروض ضخمة", megaOffersDesc: "عروض CPA (₹150+)", spinTitle: "🎡 تدور واربح", spinDesc: "اربح حتى 20 عملة!", spinNow: "تدور الآن", megaOffersTitle: "عروض ضخمة", megaOffersSub: "أكمل المهام!", socialTasksTitle: "المهام الاجتماعية", socialTasksSub: "اربح مع السوشيال ميديا!", appTestingTitle: "اختبار التطبيقات", appTestingSub: "اختبر التطبيقات!",
        totalBalance: "إجمالي الرصيد", withdrawBtn: "سحب", earningZones: "مناطق الكسب",
    dailyCheckin: "🎁 تسجيل الدخول اليومي", dailyCheckinDesc: "اربح عملات كل يوم",
    appTesting: "📱 اختبار التطبيقات", appTestingDesc: "عائد مرتفع",
    socialTasks: "💬 المهام الاجتماعية", socialTasksDesc: "شاهد وعلق",
    megaOffers: "🔥 عروض ضخمة", megaOffersDesc: "عروض CPA",
    spinTitle: "🎡 تدور واربح", spinDesc: "اربح حتى 20 عملة!", spinNow: "تدور الآن",
    megaOffersTitle: "عروض ضخمة", megaOffersSub: "أكمل المهام!",
    socialTasksTitle: "المهام الاجتماعية", socialTasksSub: "اربح مع السوشيال ميديا!",
    appTestingTitle: "اختبار التطبيقات", appTestingSub: "اختبر التطبيقات!",
    // Profile Words
    profPayment: "إعدادات الدفع", profHistory: "سجل المعاملات", profRefer: "ادعُ واكسب", profSupport: "المساعدة والدعم", profLogout: "تسجيل خروج"

        },
        ru: { totalBalance: "Общий Баланс", withdrawBtn: "Вывести", earningZones: "Зоны Заработка", dailyCheckin: "🎁 Ежедневная Отметка", dailyCheckinDesc: "Зарабатывайте ₹1 каждый день", appTesting: "📱 Тестирование Приложений", appTestingDesc: "Высокая Оплата (₹50 - ₹100)", socialTasks: "💬 Социальные Задания", socialTasksDesc: "Смотреть и Комментировать (₹10 - ₹20)", megaOffers: "🔥 Мега Предложения", megaOffersDesc: "CPA Предложения (₹150+)", spinTitle: "🎡 Крути и Выигрывай", spinDesc: "Выиграй до 20 монет!", spinNow: "Крутить", megaOffersTitle: "Мега Предложения", megaOffersSub: "Выполняйте задания!", socialTasksTitle: "Задания", socialTasksSub: "Зарабатывайте!", appTestingTitle: "Тестирование", appTestingSub: "Тестируйте!",
        totalBalance: "Общий Баланс", withdrawBtn: "Вывести", earningZones: "Зоны Заработка",
    dailyCheckin: "🎁 Ежедневная Отметка", dailyCheckinDesc: "Зарабатывайте монеты каждый день",
    appTesting: "📱 Тестирование Приложений", appTestingDesc: "Высокая Оплата",
    socialTasks: "💬 Социальные Задания", socialTasksDesc: "Смотреть и Комментировать",
    megaOffers: "🔥 Мега Предложения", megaOffersDesc: "CPA Предложения",
    spinTitle: "🎡 Крути и Выигрывай", spinDesc: "Выиграй до 20 монет!", spinNow: "Крутить",
    megaOffersTitle: "Мега Предложения", megaOffersSub: "Выполняйте задания!",
    socialTasksTitle: "Задания", socialTasksSub: "Зарабатывайте!",
    appTestingTitle: "Тестирование", appTestingSub: "Тестируйте!",
    // Profile Words
    profPayment: "Настройки Платежей", profHistory: "История Транзакций", profRefer: "Пригласи и Заработай", profSupport: "Помощь и Поддержка", profLogout: "Выйти"

        },
        pt: { totalBalance: "Saldo Total", withdrawBtn: "Retirar", earningZones: "Zonas de Ganhos", dailyCheckin: "🎁 Check-in Diário", dailyCheckinDesc: "Ganhe ₹1 todos os dias", appTesting: "📱 Teste de Apps", appTestingDesc: "Alto Pagamento (₹50 - ₹100)", socialTasks: "💬 Tarefas Sociais", socialTasksDesc: "Assistir e Comentar (₹10 - ₹20)", megaOffers: "🔥 Mega Ofertas", megaOffersDesc: "Ofertas CPA (₹150+)", spinTitle: "🎡 Gire e Ganhe", spinDesc: "Ganhe até 20 moedas!", spinNow: "Girar Agora", megaOffersTitle: "Mega Ofertas", megaOffersSub: "Ganhe dinheiro!", socialTasksTitle: "Tarefas", socialTasksSub: "Ganhe com redes sociais!", appTestingTitle: "Teste de Apps", appTestingSub: "Teste novos apps!",
        totalBalance: "Saldo Total", withdrawBtn: "Retirar", earningZones: "Zonas de Ganhos",
    dailyCheckin: "🎁 Check-in Diário", dailyCheckinDesc: "Ganhe moedas todos os dias",
    appTesting: "📱 Teste de Apps", appTestingDesc: "Alto Pagamento",
    socialTasks: "💬 Tarefas Sociais", socialTasksDesc: "Assistir e Comentar",
    megaOffers: "🔥 Mega Ofertas", megaOffersDesc: "Ofertas CPA",
    spinTitle: "🎡 Gire e Ganhe", spinDesc: "Ganhe até 20 moedas!", spinNow: "Girar Agora",
    megaOffersTitle: "Mega Ofertas", megaOffersSub: "Ganhe dinheiro!",
    socialTasksTitle: "Tarefas", socialTasksSub: "Ganhe com redes sociais!",
    appTestingTitle: "Teste de Apps", appTestingSub: "Teste novos apps!",
    // Profile Words
    profPayment: "Configurações de Pagamento", profHistory: "Histórico de Transações", profRefer: "Indique e Ganhe", profSupport: "Ajuda e Suporte", profLogout: "Sair"

        },
        ja: { totalBalance: "合計残高", withdrawBtn: "引き出し", earningZones: "収益ゾーン", dailyCheckin: "🎁 毎日チェックイン", dailyCheckinDesc: "毎日 ₹1 稼ぐ", appTesting: "📱 アプリテスト", appTestingDesc: "高配当 (₹50 - ₹100)", socialTasks: "💬 ソーシャルタスク", socialTasksDesc: "視聴してコメント (₹10 - ₹20)", megaOffers: "🔥 メガオファー", megaOffersDesc: "CPAオファー (₹150+)", spinTitle: "🎡 スピン＆ウィン", spinDesc: "最大20コイン獲得！", spinNow: "今すぐスピン", megaOffersTitle: "メガオファー", megaOffersSub: "現金を稼ごう！", socialTasksTitle: "ソーシャルタスク", socialTasksSub: "SNSで稼ぐ！", appTestingTitle: "アプリテスト", appTestingSub: "アプリをテスト！",
        totalBalance: "合計残高", withdrawBtn: "引き出し", earningZones: "収益ゾーン",
    dailyCheckin: "🎁 毎日チェックイン", dailyCheckinDesc: "毎日コインを稼ぐ",
    appTesting: "📱 アプリテスト", appTestingDesc: "高配当",
    socialTasks: "💬 ソーシャルタスク", socialTasksDesc: "視聴してコメント",
    megaOffers: "🔥 メガオファー", megaOffersDesc: "CPAオファー",
    spinTitle: "🎡 スピン＆ウィン", spinDesc: "最大20コイン獲得！", spinNow: "今すぐスピン",
    megaOffersTitle: "メガオファー", megaOffersSub: "現金を稼ごう！",
    socialTasksTitle: "ソーシャルタスク", socialTasksSub: "SNSで稼ぐ！",
    appTestingTitle: "アプリテスト", appTestingSub: "アプリをテスト！",
    // Profile Words
    profPayment: "支払い設定", profHistory: "取引履歴", profRefer: "紹介して稼ぐ", profSupport: "ヘルプとサポート", profLogout: "ログアウト"

        },
        ko: { totalBalance: "총 잔액", withdrawBtn: "출금", earningZones: "수익 구역", dailyCheckin: "🎁 일일 출석체크", dailyCheckinDesc: "매일 ₹1 벌기", appTesting: "📱 앱 테스트", appTestingDesc: "높은 지급액 (₹50 - ₹100)", socialTasks: "💬 소셜 미션", socialTasksDesc: "시청 및 댓글 (₹10 - ₹20)", megaOffers: "🔥 메가 오퍼", megaOffersDesc: "CPA 오퍼 (₹150+)", spinTitle: "🎡 스핀 앤 윈", spinDesc: "최대 20코인 획득!", spinNow: "스핀하기", megaOffersTitle: "메가 오퍼", megaOffersSub:"미션을 완료하세요!", socialTasksTitle: "소셜 미션", socialTasksSub: "돈 벌기!", appTestingTitle: "앱 테스트", appTestingSub: "테스트하고 보상받기!",
        totalBalance: "총 잔액", withdrawBtn: "출금", earningZones: "수익 구역",
    dailyCheckin: "🎁 일일 출석체크", dailyCheckinDesc: "매일 코인 벌기",
    appTesting: "📱 앱 테스트", appTestingDesc: "높은 지급액",
    socialTasks: "💬 소셜 미션", socialTasksDesc: "시청 및 댓글",
    megaOffers: "🔥 메가 오퍼", megaOffersDesc: "CPA 오퍼",
    spinTitle: "🎡 스핀 앤 윈", spinDesc: "최대 20코인 획득!", spinNow: "스핀하기",
    megaOffersTitle: "메가 오퍼", megaOffersSub: "미션을 완료하세요!",
    socialTasksTitle: "소셜 미션", 소셜TasksSub: "돈 벌기!",
    appTestingTitle: "앱 테스트", appTestingSub: "테스트하고 보상받기!",
    // Profile Words
    profPayment: "결제 설정", profHistory: "거래 내역", profRefer: "친구 초대", profSupport: "도움말 및 지원", profLogout: "로그아웃"

        },
        id: { totalBalance: "Total Saldo", withdrawBtn: "Tarik Dana", earningZones: "Zona Penghasilan", dailyCheckin: "🎁 Check-in Harian", dailyCheckinDesc: "Dapatkan ₹1 setiap hari", appTesting: "📱 Pengujian Aplikasi", appTestingDesc: "Bayaran Tinggi (₹50 - ₹100)", socialTasks: "💬 Tugas Sosial", socialTasksDesc: "Tonton & Komentar (₹10 - ₹20)", megaOffers: "🔥 Penawaran Mega", megaOffersDesc: "Penawaran CPA (₹150+)", spinTitle: "🎡 Putar & Menang", spinDesc: "Menangkan hingga 20 koin!", spinNow: "Putar Sekarang", megaOffersTitle: "Penawaran Mega", megaOffersSub: "Dapatkan uang tunai!", socialTasksTitle: "Tugas Sosial", socialTasksSub: "Dapatkan uang!", appTestingTitle: "Pengujian Aplikasi", appTestingSub: "Uji aplikasi baru!",
        totalBalance: "Total Saldo", withdrawBtn: "Tarik Dana", earningZones: "Zona Penghasilan",
    dailyCheckin: "🎁 Check-in Harian", dailyCheckinDesc: "Dapatkan koin setiap hari",
    appTesting: "📱 Pengujian Aplikasi", appTestingDesc: "Bayaran Tinggi",
    socialTasks: "💬 Tugas Sosial", socialTasksDesc: "Tonton & Komentar",
    megaOffers: "🔥 Penawaran Mega", megaOffersDesc: "Penawaran CPA",
    spinTitle: "🎡 Putar & Menang", spinDesc: "Menangkan hingga 20 koin!", spinNow: "Putar Sekarang",
    megaOffersTitle: "Penawaran Mega", megaOffersSub: "Dapatkan uang tunai!",
    socialTasksTitle: "Tugas Sosial", socialTasksSub: "Dapatkan uang!",
    appTestingTitle: "Pengujian Aplikasi", appTestingSub: "Uji aplikasi baru!",
    // Profile Words
    profPayment: "Pengaturan Pembayaran", profHistory: "Riwayat Transaksi", profRefer: "Rujuk & Dapatkan", profSupport: "Bantuan & Dukungan", profLogout: "Keluar"
}
    };

    // Auto-Language Setter
    const savedLang = localStorage.getItem("appLanguage") || "en";
    updateLanguage(savedLang);

    // Dropdown change listener
    const languageSelect = document.getElementById("languageSelect");
    if(languageSelect) {
        languageSelect.value = savedLang;
        languageSelect.addEventListener("change", function() {
            localStorage.setItem("appLanguage", this.value); 
            updateLanguage(this.value);
        });
    }

    // Word Translator Function
    function updateLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

// ==========================================
// 4. TAB SWITCH LOGIC
// ==========================================
window.switchTab = function(tab) {
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('tabLogin').classList.add('active');
        document.getElementById('tabRegister').classList.remove('active');
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('tabLogin').classList.remove('active');
        document.getElementById('tabRegister').classList.add('active');
    }
};

// ==========================================
// 5. LOGIN SUBMIT LOGIC
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const mobile = document.getElementById("loginMobile").value;
        const pass = document.getElementById("loginPassword").value;
        
        database.ref('users/' + mobile).once('value', (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === pass) {
                    localStorage.setItem("userId", mobile);
                    localStorage.setItem("userName", userData.name);
                    window.location.href = "ho.html";
                } else {
                    alert("❌ Galat Password! Kripya dobara check karein.");
                }
            } else {
                alert("⚠️ Ye number registered nahi hai. Kripya pehle Register karein.");
            }
        });
    });
}

// ==========================================
// 6. REGISTER SUBMIT LOGIC (With Refer Bonus)
// ==========================================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value;
        const mobile = document.getElementById("regMobile").value;
        const pass = document.getElementById("regPassword").value;
        const refCode = document.getElementById("regReferral").value.toUpperCase();
        
        database.ref('users/' + mobile).once('value', (snapshot) => {
            if (snapshot.exists()) {
                alert("⚠️ Ye number pehle se registered hai! Kripya Login karein.");
                switchTab('login');
            } else {
                const namePrefix = name.substring(0, 3).toUpperCase() || "USR";
                const secretCode = namePrefix + Math.floor(1000 + Math.random() * 9000);
                
                database.ref('users/' + mobile).set({
                    name: name,
                    password: pass,
                    balance: 0,
                    taskEarnings: 0,
                    coins: 50,
                    referredBy: refCode,
                    myReferCode: secretCode,
                    lastCheckIn: ""
                }).then(() => {
                    // Referral Bonus Logic
                    if (refCode && refCode.length >= 5) {
                        database.ref('users').orderByChild('myReferCode').equalTo(refCode).once('value', (refSnap) => {
                            if (refSnap.exists()) {
                                const refererKey = Object.keys(refSnap.val())[0];
                                const refData = refSnap.val()[refererKey];
                                database.ref('users/' + refererKey).update({
                                    balance: (refData.balance || 0) + 5
                                });
                            }
                        });
                    }
                    // Login karwa do
                    localStorage.setItem("userId", mobile);
                    localStorage.setItem("userName", name);
                    window.location.href = "ho.html";
                });
            }
        });
    });
}

// ==========================================
// 7. LEVEL-UP DAILY STREAK LOGIC
// ==========================================
window.dailyCheckIn = function() {
    const uid = localStorage.getItem("userId");
    if (!uid) return alert("Pehle login karein!");
    
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-IN');
    
    // Kal ki date nikalne ka logic
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-IN');
    
    database.ref('users/' + uid).once('value', (snap) => {
        if (!snap.exists()) return;
        const data = snap.val();
        let streak = data.streakCount || 0;
        let lastDate = data.lastCheckIn || "";
        
        // Check agar aaj ka le liya hai
        if (lastDate === todayStr) {
            alert("❌ Aaj ka bonus mil chuka hai! Kal aana.");
            return;
        }
        
        // Streak check logic (kal liya tha ya nahi)
        if (lastDate === yesterdayStr) {
            streak = (streak >= 7) ? 1 : streak + 1;
        } else {
            streak = 1; // Miss kiya toh reset
        }
        
        // Rewards logic
        let reward = streak * 10;
        if (streak === 7) reward = 100; // Day 7 Mega Bonus
        
        database.ref('users/' + uid).update({
            coins: (data.coins || 0) + reward,
            streakCount: streak,
            lastCheckIn: todayStr
        }).then(() => {
            alert(`🎉 Level Up! Day ${streak} Complete. +${reward} Coins Mile!`);
            location.reload();
        });
    });
};

// ==========================================
// 8. AUTO-UPDATE UI (Page khulte hi Boxes Color honge)
// ==========================================
const uidForUI = localStorage.getItem("userId");
if (uidForUI && document.getElementById("streakDaysRow")) {
    database.ref('users/' + uidForUI).once('value', (snap) => {
        if (snap.exists()) {
            const streak = snap.val().streakCount || 1;
            const streakText = document.getElementById("streakCountText");
            if (streakText) streakText.innerText = "Day " + streak;
            
            // Boxes ko color karne ka logic
            for (let i = 1; i <= 7; i++) {
                let el = document.getElementById("d" + i);
                if (el) {
                    if (i < streak) el.classList.add("claimed"); // Purane din Green
                    else if (i === streak) el.classList.add("active"); // Aaj ka din Orange
                }
            }
        }
    });
}

    // --- B. Spin & Win Logic ---
    const canvas = document.getElementById("wheelCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const prizes = [0, 5, 10, 2, 20, 1, 15, 3];
        const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a69a", "#4caf50"];
        
        // Blank Canvas Fix - Always draw the wheel
        function drawWheel() {
            const sliceAngle = (2 * Math.PI) / prizes.length;
            for (let i = 0; i < prizes.length; i++) {
                ctx.beginPath(); 
                ctx.fillStyle = colors[i]; 
                ctx.moveTo(150, 150);
                ctx.arc(150, 150, 150, i * sliceAngle, (i + 1) * sliceAngle); 
                ctx.fill();
                ctx.save(); 
                ctx.translate(150, 150); 
                ctx.rotate(i * sliceAngle + sliceAngle / 2);
                ctx.fillStyle = "white"; 
                ctx.font = "bold 18px Arial"; 
                ctx.fillText(prizes[i], 100, 10); 
                ctx.restore();
            }
        }
        drawWheel(); 

        const spinBtn = document.getElementById("spinBtn");
        if(spinBtn) {
            spinBtn.addEventListener("click", function() {
                if(!userId) {
                    alert("Please login first to spin!");
                    return;
                }

                const randomRotation = Math.floor(Math.random() * 360) + 3600;
                canvas.style.transform = `rotate(${randomRotation}deg)`;
                
                setTimeout(() => {
                    const actualDeg = randomRotation % 360;
                    const pointerAngle = (270 - actualDeg + 360) % 360;
                    const wonCoins = prizes[Math.floor(pointerAngle / (360 / prizes.length))];
                    
                    // Firebase server par Coins update karna
                    database.ref('users/' + userId + '/coins').transaction((current) => {
                        return (current || 0) + wonCoins;
                    });
                    
                    document.getElementById("spinMessage").innerText = `You won ${wonCoins} Coins!`;
                }, 4000);
            });
        }
    }

    // --- C. Withdraw Logic ---
    const withdrawBtn = document.querySelector(".withdraw-btn");
    if (withdrawBtn) {
        withdrawBtn.addEventListener("click", () => {
            const bal = parseFloat(localStorage.getItem("walletBalance")) || 0;
            if (bal >= 100) {
                document.getElementById("withdrawModal").style.display = "flex";
            } else {
                alert(`Minimum withdrawal limit ₹100 hai. Aapko ₹${(100 - bal).toFixed(2)} aur kamane honge.`);
            }
        });
    }
});
