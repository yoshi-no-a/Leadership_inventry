/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  RefreshCcw, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Target,
  Heart,
  ShieldAlert,
  Zap
} from 'lucide-react';

// 診断結果の型定義
interface DiagnosisResult {
  id: string;
  title: string;
  description: string;
  adlerPoint: string;
  action: string;
  icon: React.ReactNode;
}

// 質問の型定義
interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

const RESULTS: DiagnosisResult[] = [
  {
    id: "approval",
    title: "承認欲求の奴隷型",
    description: "あなたはとても優しく、周囲の空気を大切にできる方ですね。しかし、部下から「嫌われたくない」「良い上司だと思われたい」という気持ちが強すぎるあまり、伝えるべきことを飲み込んでしまっていませんか？ その優しさが、結果としてチームの規律を曖昧にし、あなた自身の首を絞めてしまっているかもしれません。あなたが本当に大切にすべきなのは、部下からの「一時的な評価」ではなく、彼らの「長期的な成長」であるはずです。",
    adlerPoint: "アドラー心理学では『嫌われる勇気』が重要です。他者の評価をコントロールすることはできません。自分の課題（誠実に指導すること）と他者の課題（それをどう受け止めるか）を明確に分離しましょう。あなたが誠実に接していれば、一時的に嫌われたとしても、それはあなたの価値を損なうものではありません。",
    action: "まずは「嫌われてもいい、私は私の役割を果たす」と自分に許可を出してあげてください。部下の成長のために必要なフィードバックを、感情的にならず、誠実な『提案』として伝えることから始めてみましょう。あなたの真剣な想いは、いつか必ず伝わります。",
    icon: <Heart className="w-12 h-12 text-pink-500" />
  },
  {
    id: "separation",
    title: "課題の分離不全型",
    description: "責任感が非常に強く、何事も自分事として捉えられる素晴らしい資質をお持ちです。しかし、部下の失敗や成長の遅れまで「すべて自分の責任」として過剰に抱え込んで、夜も眠れないほど悩んでいませんか？ 部下が自分で解決すべき問題まであなたが肩代わりしてしまうと、部下は「自分で考える機会」を奪われ、いつまでも自立できなくなってしまいます。あなたの献身が、皮肉にも部下の成長を止めている可能性があるのです。",
    adlerPoint: "「これは最終的に誰の課題か？」を常に問いかけましょう。その選択の結果を最終的に引き受けるのが誰かを考え、部下の課題に土足で踏み込まない勇気が必要です。冷たく突き放すのではなく、部下が自分の足で立てるように『見守る』ことが、真のリーダーシップにおける愛なのです。",
    action: "部下を「未熟な存在」ではなく「自ら解決する力を持つ存在」だと信じてみてください。手助けは相手から求められた時に限定し、それ以外は「いつでも相談に乗るよ」というスタンスで一歩引いて見守る練習をしましょう。あなたが楽になれば、部下も伸び伸びと動けるようになります。",
    icon: <ShieldAlert className="w-12 h-12 text-orange-500" />
  },
  {
    id: "superiority",
    title: "優越性の追求（不適切）型",
    description: "向上心が高く、常に高い成果を追い求めるプロフェッショナルな姿勢は尊敬に値します。ただ、その高い基準を部下にも同じように求め、自分のやり方を正解として押し付けてしまっていませんか？ 部下はあなたに圧倒され、「支配されている」「否定されている」と感じて、思考停止に陥っているかもしれません。あなたが有能であればあるほど、部下は自分の無力さを感じ、自信を失ってしまうというジレンマが起きています。",
    adlerPoint: "健全な優越性の追求とは、他者との比較ではなく「理想の自分」との比較です。部下をコントロールしようとするのは、心のどこかにある劣等感の裏返しである『優越コンプレックス』かもしれません。他者を屈服させることで自分の価値を確認するのではなく、自分自身の成長に目を向けましょう。",
    action: "部下を「教え導く対象」ではなく、共通の目標に向かう「対等な仲間」として再定義してみてください。あなたのやり方を教えるのではなく、部下のやり方を聞き、それをどう活かせるかを一緒に考える時間を持ちましょう。あなたの「弱さ」を少し見せることで、部下との距離はぐっと縮まります。",
    icon: <Zap className="w-12 h-12 text-yellow-500" />
  },
  {
    id: "external_blame",
    title: "他責・環境依存型",
    description: "今のあなたは、会社の方針や上層部の無理解、あるいは「最近の若手」の質の低さに、強い憤りや諦めを感じているのではないでしょうか。「上がこうだから」「環境が悪いから」と、自分ではどうしようもないことに意識が向きすぎて、無力感に苛まれているようです。そのストレスは相当なものでしょう。しかし、周囲を責めている間は、あなた自身のリーダーとしての影響力もまた、周囲によって制限されてしまっています。",
    adlerPoint: "アドラー心理学では、置かれた環境をどう解釈し、どう行動するかは自分次第だと考えます。会社や上司を変えることは難しいかもしれませんが、その状況下で『自分に何ができるか』に集中することが、精神的な自由への第一歩です。他責は、自分の人生のハンドルを他人に渡してしまっている状態なのです。",
    action: "「もし環境が完璧だったら」と考えるのを一度やめてみましょう。今の「不完全な環境」の中で、あなたの権限で変えられる最小のことは何でしょうか？ 上司の愚痴を言う時間を、部下との信頼関係を1ミリ深める時間に充ててみてください。あなたが主体的になれば、周囲の景色も少しずつ変わり始めます。",
    icon: <AlertCircle className="w-12 h-12 text-red-600" />
  },
  {
    id: "community",
    title: "共同体感覚の欠如型",
    description: "非常に合理的で、効率的に物事を進める能力に長けています。しかし、気づかないうちに「自分の評価」や「自分のメンツ」を守ることを最優先に判断を下していませんか？ チームのメンバーは、あなたの言葉の端々に「自分を守ろうとする意図」を感じ取り、心の底から協力しようという意欲を失っているかもしれません。孤軍奮闘している感覚があるなら、それはあなたが周囲を「敵」や「評価者」として見ているからかもしれません。",
    adlerPoint: "アドラーが説く幸せの鍵は『共同体感覚』です。これは他者を仲間と見なし、そこに居場所があると感じる感覚です。自分を大きく見せる必要はありません。ありのままの自分で、周囲にどう貢献できるかを考えることが、結果としてあなた自身の居場所と心の安らぎを作ります。",
    action: "「自分はどう見られているか」という自意識を脇に置いて、「このチームのために、今自分ができる小さなことは何か」を考えてみてください。部下の小さな成功を一緒に喜び、困っている時にそっと手を差し伸べる。そんな損得抜きの行動が、強固な信頼関係の土台となります。",
    icon: <Users className="w-12 h-12 text-blue-500" />
  },
  {
    id: "discouragement",
    title: "勇気くじきリーダー型",
    description: "あなたは仕事に対して非常に誠実で、部下にも「もっと良くなってほしい」という強い願いを持っています。だからこそ、つい欠点や改善点ばかりが目に付いて、厳しい指摘を繰り返してしまっているのですね。しかし、その「良かれと思ったダメ出し」が、部下から挑戦するエネルギーを奪い、彼らを萎縮させてしまっています。部下は「自分は何をやっても認められない」と絶望し、成長の芽が摘まれている状態です。",
    adlerPoint: "教育や指導において最も大切なのは『勇気づけ』です。これは、困難を克服する力を与えることです。欠点（マイナス）を指摘してゼロにするのではなく、できていること（プラス）に注目してそれを伸ばしましょう。不完全な状態であっても、そのプロセスや努力を認めることが勇気づけです。",
    action: "今日から「指摘」の前に、必ず「感謝」か「肯定」をセットにしてみてください。当たり前の業務をこなしていること自体に「いつも助かっているよ」と声をかける。結果が出なくても「その工夫は良かったね」とプロセスを認める。あなたの温かい一言が、部下の止まっていたエンジンを再び動かします。",
    icon: <AlertCircle className="w-12 h-12 text-red-500" />
  },
  {
    id: "vertical",
    title: "垂直な関係固執型",
    description: "組織の秩序を重んじ、責任を全うしようとする真面目な性格の方です。ただ、「上司は指示し、部下は従うもの」という上下関係のフレームワークに縛られすぎて、部下との間に見えない壁を作っていませんか？ 命令や賞罰（褒める・叱る）で人を動かそうとすると、部下は「怒られないため」「褒められるため」に動くようになり、自発性が失われます。あなたは孤独な指揮官になってしまっているかもしれません。",
    adlerPoint: "アドラーは『横の関係（対等な関係）』を提唱しました。職能上の役割や経験の差はあっても、人間としては一等も二等もありません。上から評価するのではなく、横から支援する。このパラダイムシフトが、部下の内発的な動機付けを引き出す唯一の道です。",
    action: "部下を「評価する対象」ではなく「相談する相手」として接してみてください。「君はどう思う？」「何か手伝えることはある？」と、対等なパートナーとして意見を求めることから始めましょう。あなたが「教える人」から「支える人」に変わった時、チームの雰囲気は劇的に変わります。",
    icon: <Target className="w-12 h-12 text-indigo-500" />
  },
  {
    id: "teleology",
    title: "目的論の無視型",
    description: "分析力に優れ、問題の原因を突き止めるのが得意な方ですね。しかし、部下のミスに対して「なぜそうなったのか」という過去の原因ばかりを問い詰め、犯人探しのようなコミュニケーションになっていませんか？ 過去を掘り返されても、部下は言い訳を考えるか、自己嫌悪に陥るだけです。原因を知ることは大切ですが、そこに留まっていては、チームは前向きなエネルギーを失ってしまいます。",
    adlerPoint: "アドラー心理学の根幹は『目的論』です。人は過去の原因によって動かされるのではなく、自ら設定した『未来の目的』のために動きます。部下がミスをした時、その行動の裏にはどんな目的があったのか、そしてこれからはどんな目的を持って動くべきかを考えるのが建設的なアプローチです。",
    action: "「なぜ（Why）」という言葉を、「これからどうする（How）」に置き換えてみてください。過去の失敗を責めるのではなく、「この経験を次にどう活かそうか？」と一緒に未来の作戦会議をしましょう。視点が未来に向いた時、部下は自ら解決策を見つけ出す力を発揮し始めます。",
    icon: <RefreshCcw className="w-12 h-12 text-green-500" />
  },
  {
    id: "self-acceptance",
    title: "自己受容不足型",
    description: "自分に対して非常に厳しく、常に高みを目指して努力を惜しまないストイックな方です。その反面、自分の不完全さや弱さを認めることができず、常に「もっと頑張らなければ」と自分を追い詰めていませんか？ 自分が自分を許せていないと、無意識のうちに部下に対しても同じ厳しさを投影し、不寛容になってしまいます。あなたの心の余裕のなさが、チーム全体の緊張感を生んでいます。",
    adlerPoint: "『自己受容』とは、肯定的なあきらめです。できない自分を「ダメだ」と否定するのではなく、今のありのままの自分を認め、そこからどうするかを考えることです。完璧なリーダーなど存在しません。あなたが自分の不完全さを認めることで、初めて他者の不完全さも包み込めるようになります。",
    action: "まずは自分自身に「よく頑張っているね」と声をかけてあげてください。自分の弱点や失敗を、部下の前で少しだけ開示してみるのも良いでしょう。「私もここは苦手なんだ、助けてほしい」と言えるリーダーこそが、部下の貢献意欲を引き出し、真に強いチームを作ることができるのです。",
    icon: <Heart className="w-12 h-12 text-purple-500" />
  },
  {
    id: "contribution",
    title: "貢献感の空回り型",
    description: "誰よりもチームのことを思い、献身的に動ける素晴らしい貢献心の持ち主です。それなのに、「自分ばかりが頑張っている」「誰も私の苦労を分かってくれない」という孤独感や被害者意識に苦しんでいませんか？ 自分の貢献が他者から認められないことに不満を感じると、せっかくの善意が「押し付け」や「怒り」に変わってしまいます。あなたの優しさが、悲鳴を上げている状態です。",
    adlerPoint: "貢献感とは、他者が認めてくれるかどうかに関わらず、自分が誰かの役に立っているという『主観的な感覚』です。他者の評価を期待すると、それは貢献ではなく『取引』になってしまいます。他者がどう思うかは他者の課題。あなたはただ、自分の貢献そのものを喜びとして良いのです。",
    action: "「ありがとう」と言われることを期待するのを一度手放してみましょう。あなたが今日、誰かのためにした小さなことが、結果としてチームを支えているという事実そのものを自分で認めてあげてください。見返りを求めない純粋な貢献は、巡り巡って最高の信頼としてあなたに返ってきます。",
    icon: <CheckCircle2 className="w-12 h-12 text-teal-500" />
  },
  {
    id: "attention",
    title: "不適切な注目への反応型",
    description: "面倒見が良く、困っている人を放っておけない心優しいリーダーです。しかし、問題を起こす部下や、手のかかる部下の対応にばかり時間を取られ、疲れ果てていませんか？ その一方で、着実に成果を出している優秀な部下や、静かに頑張っているメンバーを放置してしまっているかもしれません。あなたの貴重なエネルギーが、チームの生産性を下げる方向に使われてしまっている可能性があります。",
    adlerPoint: "人は『注目』される行動を繰り返す習性があります。不適切な行動（ミスや不平不満）に過剰に反応すると、部下は「注目を得るために」その行動を続けてしまいます。これを『不適切な注目』と呼びます。逆に、適切な行動（当たり前の業務）にこそ、光を当てる必要があります。",
    action: "「問題がない状態」を当たり前と思わず、真面目に頑張っている部下にこそ意識的に声をかけてください。「いつも助かっているよ」「その資料、分かりやすかった」といった小さな注目が、チーム全体の健全な成長を促します。問題児への対応は最小限にし、プラスの行動を増やすことに注力しましょう。",
    icon: <Users className="w-12 h-12 text-cyan-500" />
  }
];

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "部下に厳しい注意をしなければならない時、あなたの心境は？",
    options: [
      { text: "嫌われたくない、関係が悪くなるのが怖い", scores: { approval: 3, self_acceptance: 1 } },
      { text: "自分の指導不足だと思い、落ち込む", scores: { separation: 3, self_acceptance: 2 } },
      { text: "上司としての権威を示し、従わせるべきだと思う", scores: { vertical: 3, superiority: 2 } },
      { text: "相手の成長のために必要だと割り切って伝える", scores: { community: 2, contribution: 1 } }
    ]
  },
  {
    id: 2,
    text: "部下が大きなミスをした時、真っ先に口に出る言葉は？",
    options: [
      { text: "「なんでこんなことしたの？（原因追及）」", scores: { teleology: 3, discouragement: 2 } },
      { text: "「大丈夫、私がなんとかしておくよ（肩代わり）」", scores: { separation: 3, approval: 1 } },
      { text: "「次はどうすれば防げるかな？（未来志向）」", scores: { community: 2 } },
      { text: "「私の顔に泥を塗るつもりか！（メンツ）」", scores: { community: 3, superiority: 2 } }
    ]
  },
  {
    id: 3,
    text: "チームの成果が上がらない時、一番の要因は何だと感じますか？",
    options: [
      { text: "会社の方針や上層部の理解が足りないからだ", scores: { external_blame: 3, community: 1 } },
      { text: "部下たちの能力ややる気が低すぎるからだ", scores: { external_blame: 2, superiority: 2, discouragement: 1 } },
      { text: "自分のリーダーシップに何らかの欠陥があるからだ", scores: { self_acceptance: 2, separation: 2 } },
      { text: "今の環境で、自分たちにできる最善を探すべきだ", scores: { community: 2, external_blame: -1 } }
    ]
  },
  {
    id: 4,
    text: "チームの目標達成において、あなたの役割は何だと思いますか？",
    options: [
      { text: "全員を完璧にコントロールし、導くこと", scores: { superiority: 3, vertical: 2 } },
      { text: "部下が働きやすいよう、顔色を伺いながら調整すること", scores: { approval: 3, separation: 1 } },
      { text: "困難を共に乗り越えるための勇気を与えること", scores: { community: 2, contribution: 1 } },
      { text: "自分が一番成果を出し、背中を見せること", scores: { contribution: 3, superiority: 1 } }
    ]
  },
  {
    id: 5,
    text: "部下が新しい提案をしてきたが、あまり筋が良くない時、どう反応する？",
    options: [
      { text: "「ここがダメだ」と論理的に欠点を指摘する", scores: { discouragement: 3, vertical: 1 } },
      { text: "「面白いね」と、まずは提案した意欲を認める", scores: { community: 2, self_acceptance: 1 } },
      { text: "自分のやり方を教え、それに従わせる", scores: { superiority: 3, vertical: 2 } },
      { text: "角が立たないよう、曖昧に濁して流す", scores: { approval: 3, teleology: 1 } }
    ]
  },
  {
    id: 6,
    text: "仕事が忙しく、自分だけが残業している時の心境は？",
    options: [
      { text: "「自分ばかり損をしている」と周囲に不満を感じる", scores: { contribution: 3, community: 2 } },
      { text: "「自分がいないとこのチームは回らない」と優越感に浸る", scores: { superiority: 3, contribution: 1 } },
      { text: "「部下に任せられない自分が悪い」と自分を責める", scores: { self_acceptance: 3, separation: 2 } },
      { text: "「今は自分の役割だ」と受け入れ、淡々とこなす", scores: { contribution: 1, community: 1 } }
    ]
  },
  {
    id: 7,
    text: "部下を褒める時、どのような言葉をかけることが多いですか？",
    options: [
      { text: "「よくやった、偉いぞ」と評価する", scores: { vertical: 3, superiority: 1 } },
      { text: "「助かったよ、ありがとう」と感謝を伝える", scores: { community: 3, contribution: 2 } },
      { text: "特に何も言わない（できて当たり前だと思う）", scores: { discouragement: 3, vertical: 2 } },
      { text: "他の部下と比較して「君が一番だ」と言う", scores: { superiority: 3, vertical: 1 } }
    ]
  },
  {
    id: 8,
    text: "問題児と呼ばれる部下に対して、どのように接していますか？",
    options: [
      { text: "更生させようと、付きっきりで指導する", scores: { attention: 3, separation: 2 } },
      { text: "関わると疲れるので、できるだけ避ける", scores: { approval: 2, community: 1 } },
      { text: "厳しく罰を与えて、行動を矯正しようとする", scores: { vertical: 3, discouragement: 2 } },
      { text: "適切な行動をした時だけ、しっかり注目する", scores: { attention: 1, community: 2 } }
    ]
  },
  {
    id: 9,
    text: "上司としての「理想の姿」について、どう考えていますか？",
    options: [
      { text: "弱みを見せず、常に完璧で頼れる存在", scores: { self_acceptance: 3, superiority: 2 } },
      { text: "部下から慕われ、誰からも好かれる存在", scores: { approval: 3, community: 1 } },
      { text: "部下の自立を促し、自分がいなくても回る状態を作る存在", scores: { separation: 2, community: 2 } },
      { text: "圧倒的なカリスマ性でチームを引っ張る存在", scores: { superiority: 3, vertical: 2 } }
    ]
  }
];

export default function App() {
  const [step, setStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setScores({});
  };

  const handleAnswer = (optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, value]) => {
      newScores[key] = (newScores[key] || 0) + value;
    });
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const getTopResult = () => {
    let maxScore = -1;
    let topId = RESULTS[0].id;

    const scoreEntries = Object.entries(scores) as [string, number][];
    scoreEntries.forEach(([id, score]) => {
      if (score > maxScore) {
        maxScore = score;
        topId = id;
      }
    });

    return RESULTS.find(r => r.id === topId) || RESULTS[0];
  };

  const result = getTopResult();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  リーダースタイル診断
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  アドラー心理学に基づき、あなたが部下や後輩との関係で<br className="hidden sm:inline" />
                  陥りやすい「課題」を可視化します。<br />
                  <span className="text-sm font-medium text-indigo-600 mt-2 block">
                    ※あなたが部下と接するときに感じていることを素直に答えてください。
                  </span>
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-center">
                  <Users className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">こんな悩みはありませんか？</h2>
                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>・部下にどう接していいか分からない</li>
                    <li>・良かれと思って言ったことが裏目に出る</li>
                    <li>・自分ばかりが疲弊している気がする</li>
                  </ul>
                </div>
                <button
                  onClick={startQuiz}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  診断をはじめる
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                    Question {currentQuestion + 1} / {QUESTIONS.length}
                  </span>
                  <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {QUESTIONS[currentQuestion].text}
                </h2>
              </div>

              <div className="grid gap-4">
                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.scores)}
                    className="p-5 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex justify-between items-center"
                  >
                    <span className="text-lg font-medium text-slate-700 group-hover:text-indigo-900">
                      {option.text}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                  診断結果
                </span>
                <h2 className="text-3xl font-bold text-slate-900">あなたの課題スタイルは...</h2>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 text-center space-y-6 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-center">
                    {result.icon}
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                    {result.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold">
                      <BookOpen className="w-5 h-5" />
                      <span>アドラー心理学の視点</span>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 leading-relaxed">
                      {result.adlerPoint}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-teal-600 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>今日からできるアクション</span>
                    </div>
                    <div className="bg-teal-50 p-6 rounded-2xl text-teal-900 leading-relaxed">
                      {result.action}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white p-8 rounded-3xl space-y-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">もっと詳しく学びたい方へ</h4>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      この診断のベースとなっている考え方は、書籍でより深く解説されています。
                      優しいリーダーが、自分も相手も大切にしながら成果を出すためのバイブルです。
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <span className="font-bold text-center sm:text-left">
                    「優しい人でも疲れない アドラー心理学のリーダーシップ」
                  </span>
                  <a 
                    href="https://amzn.asia/d/0hWCVn55" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors whitespace-nowrap"
                  >
                    本をチェックする
                  </a>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                もう一度診断する
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center text-slate-400 text-xs">
          <p>© 2026 リーダースタイル診断 | Based on Adlerian Psychology</p>
        </footer>
      </div>
    </div>
  );
}
