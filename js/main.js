// スマートフォン料金プラン診断システム - メインロジック

// 質問データ
const questions = [
    {
        id: 1,
        title: "毎月のデータ使用量に最も近いものを選んでください。",
        options: [
            { value: "A", label: "3GB以下", description: "Wi-Fiメインで、外出先ではLINEやWeb検索が中心" },
            { value: "B", label: "3GBから20GB程度", description: "SNSや動画を日常的に利用" },
            { value: "C", label: "20GB以上", description: "データ量を気にせず使いたい、テザリングも利用" },
            { value: "D", label: "月によって大きく変動する", description: "" }
        ]
    },
    {
        id: 2,
        title: "電話番号を使った通話の利用状況を教えてください。",
        options: [
            { value: "A", label: "ほとんど利用しない", description: "LINE通話がメイン" },
            { value: "B", label: "短い電話を時々利用する", description: "" },
            { value: "C", label: "長電話をすることがある、または仕事で頻繁に利用する", description: "" }
        ]
    },
    {
        id: 3,
        title: "契約や設定について、どちらのタイプですか？",
        options: [
            { value: "A", label: "オンラインで自己解決できる", description: "" },
            { value: "B", label: "店舗での対面サポートが必要", description: "" }
        ]
    },
    {
        id: 4,
        title: "主に利用しているポイントサービスはありますか？",
        options: [
            { value: "A", label: "楽天ポイント", description: "" },
            { value: "B", label: "dポイント, Pontaポイント, PayPayポイントなど", description: "" },
            { value: "C", label: "特にない", description: "" }
        ]
    }
];

// プランデータ
const plans = {
    rakuten: {
        name: "楽天モバイル (Rakuten最強プラン)",
        target: "月々のデータ利用量に波がある方や、通信量を気にせず使いたい方。",
        features: {
            price: "使った分だけお支払い (〜3GB: 1,078円, 〜20GB: 2,178円, それ以上: 3,278円)",
            data: "無制限",
            call: "Rakuten Linkアプリ利用で国内通話が無料"
        },
        highlight: "毎月のデータ使用量を予測する必要がなく、使わなかった月は自動で安くなり、使った月も上限が決まっているため、料金プランで悩む手間がありません。通話料を気にしなくていいのも大きなメリットです。",
        caution: "Rakuten Linkアプリ以外での通話は別途料金がかかります。"
    },
    ahamo: {
        name: "ahamo",
        target: "20GBのデータ量と5分以内の通話が多い、バランスの取れた使い方をされる方。",
        features: {
            price: "2,970円",
            data: "20GB",
            call: "5分以内の国内通話が無料"
        },
        highlight: "ドコモの高品質な回線を、シンプルな料金で利用できます。海外でも20GBまで追加料金なしで使えるため、旅行や出張が多い方にも便利です。",
        caution: "サポートはオンラインのみとなります。5分を超えた通話には料金が発生します。"
    },
    linemoMini: {
        name: "LINEMO (ミニプラン)",
        target: "データ使用量が少なく、LINEを中心に使う方。",
        features: {
            price: "990円",
            data: "3GB",
            call: "LINE通話は使い放題（データ消費なし）"
        },
        highlight: "LINEのトークや通話がデータ消費なしで使い放題。月額料金が非常にリーズナブルです。",
        caution: "通常の音声通話は22円/30秒の従量課金です。店舗サポートはありません。"
    },
    linemoSmartphone: {
        name: "LINEMO (スマホプラン)",
        target: "中容量のデータと、LINEを頻繁に使う方。",
        features: {
            price: "2,728円",
            data: "20GB",
            call: "LINE通話は使い放題（データ消費なし）"
        },
        highlight: "20GBの大容量でLINEが使い放題。ソフトバンクの高品質な回線を利用できます。",
        caution: "通常の音声通話は22円/30秒の従量課金です。店舗サポートはありません。"
    },
    iijmio: {
        name: "IIJmio",
        target: "データ通信をメインに使い、料金を抑えたい方。",
        features: {
            price: "990円",
            data: "5GB",
            call: "通話は従量課金（11円/30秒）"
        },
        highlight: "5GBという使いやすいデータ量を低価格で提供。通話料も他社の半額です。",
        caution: "平日12時台に通信速度が低下する可能性があります。"
    },
    nihonSimple: {
        name: "日本通信SIM (合理的シンプル290プラン)",
        target: "とにかく料金を抑えたい、最小限の利用で十分な方。",
        features: {
            price: "290円",
            data: "1GB",
            call: "通話は従量課金（11円/30秒）"
        },
        highlight: "業界最安値クラスの月額料金。必要最小限の機能で十分な方に最適です。",
        caution: "データ量が1GBと少ないため、Wi-Fi環境がメインの方向けです。平日昼の通信速度が遅くなる可能性があります。"
    },
    nihonMinna: {
        name: "日本通信SIM (合理的みんなのプラン)",
        target: "中容量のデータと無料通話が欲しい方。",
        features: {
            price: "1,390円",
            data: "10GB",
            call: "70分無料通話 or 5分かけ放題付き"
        },
        highlight: "10GBのデータと通話オプションがセットでこの価格。コストパフォーマンスが優秀です。",
        caution: "平日昼の通信速度が遅くなる可能性があります。"
    },
    nihonKakeho: {
        name: "日本通信SIM (合理的かけほプラン)",
        target: "データ通信はそこそこで、とにかく通話料を気にせず電話をかけたい方。",
        features: {
            price: "2,728円",
            data: "3GB",
            call: "国内通話が完全かけ放題"
        },
        highlight: "専用アプリ不要で、標準の電話アプリからかけ放題が利用できます。月々の料金が完全に固定されるため、予算管理がしやすいです。",
        caution: "データ量は3GBと少なめです。平日昼の通信速度が遅くなる可能性があります。"
    }
};
// 状態管理
let currentQuestion = 0;
let answers = {};

// DOM要素の取得
const introSection = document.getElementById('intro-section');
const questionSection = document.getElementById('question-section');
const resultSection = document.getElementById('result-section');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionTitle = document.getElementById('question-title');
const questionOptions = document.getElementById('question-options');
const resultContent = document.getElementById('result-content');

// イベントリスナーの設定
startBtn.addEventListener('click', startDiagnosis);
prevBtn.addEventListener('click', previousQuestion);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartDiagnosis);

// 診断開始
function startDiagnosis() {
    introSection.classList.add('hidden');
    questionSection.classList.remove('hidden');
    currentQuestion = 0;
    answers = {};
    showQuestion();
}

// 質問表示
function showQuestion() {
    const question = questions[currentQuestion];
    
    // プログレスバー更新
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestion + 1} / ${questions.length}`;
    
    // 質問タイトル
    questionTitle.textContent = question.title;
    
    // 選択肢の表示
    questionOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card bg-white border-2 border-gray-200 rounded-lg p-4 flex items-start cursor-pointer hover:bg-gray-50';
        optionCard.dataset.value = option.value;
        
        const indicator = document.createElement('div');
        indicator.className = 'option-indicator w-6 h-6 rounded-full border-2 border-gray-400 mr-3 mt-1 flex items-center justify-center';
        
        const content = document.createElement('div');
        content.className = 'flex-1';
        
        const label = document.createElement('div');
        label.className = 'font-semibold text-gray-800';
        label.textContent = `${option.value}. ${option.label}`;
        content.appendChild(label);
        
        if (option.description) {
            const description = document.createElement('div');
            description.className = 'text-sm text-gray-600 mt-1';
            description.textContent = option.description;
            content.appendChild(description);
        }
        
        optionCard.appendChild(indicator);
        optionCard.appendChild(content);
        
        // 既に選択されている場合
        if (answers[currentQuestion] === option.value) {
            optionCard.classList.add('selected');
            indicator.innerHTML = '<i class="fas fa-check text-xs"></i>';
        }
        
        optionCard.addEventListener('click', () => selectOption(option.value));
        
        // アニメーション付きで表示
        setTimeout(() => {
            optionCard.classList.add('fade-in');
        }, index * 50);
        
        questionOptions.appendChild(optionCard);
    });
    
    // ボタンの状態更新
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = !answers[currentQuestion];
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.innerHTML = '診断結果を見る<i class="fas fa-check ml-2"></i>';
    } else {
        nextBtn.innerHTML = '次の質問<i class="fas fa-arrow-right ml-2"></i>';
    }
}

// 選択肢の選択
function selectOption(value) {
    answers[currentQuestion] = value;
    
    // 全ての選択肢のスタイルをリセット
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
        const indicator = card.querySelector('.option-indicator');
        indicator.innerHTML = '';
    });
    
    // 選択された選択肢のスタイルを更新
    const selectedCard = document.querySelector(`[data-value="${value}"]`);
    selectedCard.classList.add('selected');
    const indicator = selectedCard.querySelector('.option-indicator');
    indicator.innerHTML = '<i class="fas fa-check text-xs check-animation"></i>';
    
    // 次へボタンを有効化
    nextBtn.disabled = false;
}

// 前の質問へ
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

// 次の質問へ
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

// 診断結果の表示
function showResults() {
    questionSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    const recommendations = getRecommendations();
    
    resultContent.innerHTML = '';
    recommendations.forEach((plan, index) => {
        const resultCard = createResultCard(plan, index + 1);
        resultContent.appendChild(resultCard);
    });
    
    // スクロールトップ
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 推奨プランの取得
function getRecommendations() {
    const q1 = answers[0]; // データ使用量
    const q2 = answers[1]; // 通話頻度
    const q3 = answers[2]; // サポート体制
    const q4 = answers[3]; // ポイントサービス
    
    const recommendations = [];
    
    // 楽天モバイル最優先ルール
    const shouldPrioritizeRakuten = 
        q1 === 'D' || // データ使用量が変動
        q1 === 'C' || // 大容量ユーザー
        (q1 === 'B' && q2 === 'C') || // 中容量で長電話
        q4 === 'A'; // 楽天ポイントユーザー
    
    if (shouldPrioritizeRakuten) {
        recommendations.push(plans.rakuten);
        
        // 追加の推奨プラン
        if (q2 === 'C') {
            // かけ放題ニーズ
            recommendations.push(plans.nihonKakeho);
        }
        
        if (q1 === 'B') {
            // 中容量ユーザー
            if (recommendations.length < 3) {
                recommendations.push(plans.ahamo);
            }
        } else if (q1 === 'A') {
            // 小容量ユーザー
            if (recommendations.length < 3) {
                recommendations.push(plans.nihonSimple);
            }
            if (recommendations.length < 3) {
                recommendations.push(plans.iijmio);
            }
        }
    } else {
        // 楽天モバイル以外の推奨ロジック
        if (q1 === 'A') {
            // 小容量ユーザー
            recommendations.push(plans.nihonSimple);
            recommendations.push(plans.iijmio);
            if (q2 === 'A') {
                recommendations.push(plans.linemoMini);
            }
        } else if (q1 === 'B') {
            // 中容量ユーザー
            if (q2 === 'C') {
                // かけ放題ニーズ
                recommendations.push(plans.nihonKakeho);
                recommendations.push(plans.nihonMinna);
            } else {
                recommendations.push(plans.ahamo);
                recommendations.push(plans.linemoSmartphone);
            }
            // 楽天モバイルを3番目に追加
            if (recommendations.length < 3) {
                recommendations.push(plans.rakuten);
            }
        }
    }
    
    // 最大3つまでに制限
    return recommendations.slice(0, 3);
}

// 結果カードの作成
function createResultCard(plan, number) {
    const card = document.createElement('div');
    card.className = 'result-card rounded-lg p-6 shadow-md fade-in';
    
    // タイトル
    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex items-center mb-4';
    
    const badge = document.createElement('span');
    badge.className = 'plan-badge';
    badge.textContent = number;
    
    const title = document.createElement('h3');
    title.className = 'text-xl font-bold text-gray-800';
    title.textContent = plan.name;
    
    titleDiv.appendChild(badge);
    titleDiv.appendChild(title);
    card.appendChild(titleDiv);
    
    // こんな方に
    const targetDiv = document.createElement('div');
    targetDiv.className = 'mb-4';
    targetDiv.innerHTML = `<strong class="text-gray-700">こんな方に:</strong> ${plan.target}`;
    card.appendChild(targetDiv);
    
    // 特徴
    const featuresDiv = document.createElement('div');
    featuresDiv.className = 'mb-4';
    featuresDiv.innerHTML = `
        <strong class="text-gray-700">特徴:</strong>
        <ul class="list-disc list-inside ml-4 mt-2 text-gray-600">
            <li>料金: <span class="price-highlight">${plan.features.price}</span></li>
            <li>データ量: ${plan.features.data}</li>
            <li>通話: ${plan.features.call}</li>
        </ul>
    `;
    card.appendChild(featuresDiv);
    
    // 注目ポイント
    const highlightDiv = document.createElement('div');
    highlightDiv.className = 'highlight-box';
    highlightDiv.innerHTML = `<strong class="text-blue-700">注目ポイント:</strong> ${plan.highlight}`;
    card.appendChild(highlightDiv);
    
    // 注意点
    const cautionDiv = document.createElement('div');
    cautionDiv.className = 'warning-box';
    cautionDiv.innerHTML = `<strong class="text-amber-700">注意点:</strong> ${plan.caution}`;
    card.appendChild(cautionDiv);
    
    return card;
}

// 診断をやり直す
function restartDiagnosis() {
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    currentQuestion = 0;
    answers = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
