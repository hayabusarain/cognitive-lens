"use client";

import { ExternalLink, Briefcase, HeartPulse } from "lucide-react";
import { TYPE_INFO, DEFAULT_TYPE } from "@/lib/type-info";
import Link from "next/link";

export default function NextActionCTA({ typeKey, lang }: { typeKey: string; lang: string }) {
  const info = TYPE_INFO[typeKey] ?? DEFAULT_TYPE;
  const isEn = lang === "en";

  const getJobText = () => {
    switch(typeKey) {
      case "INTJ": return "無能に囲まれてストレスを抱えるくらいなら、あなたの戦略眼が評価される環境を探すべきです。";
      case "INTP": return "くだらない社内政治に巻き込まれない、あなたの思考力が100%活きる専門職を探しましょう。";
      case "ENTJ": return "他人のペースに合わせてイライラするより、自分がトップに立てる環境や裁量の大きい仕事が必要です。";
      case "ENTP": return "単調なルーティンワークは才能の無駄遣い。飽き性のあなたが常に刺激をもらえる場所を見つけましょう。";
      case "INFJ": return "他人の感情に振り回されない、あなたの深い洞察力と理想を追求できる静かな環境が必要です。";
      case "INFP": return "「合わない環境」で自分を殺すのはやめましょう。あなたの感性や価値観を大切にできる場所が必ずあります。";
      case "ENFJ": return "あなたのカリスマ性が「ただのおせっかい」として消費されない、本当に人を導ける環境を探すべきです。";
      case "ENFP": return "堅苦しいルールであなたの自由を縛る環境からは今すぐ逃げて、ワクワクできる場所を見つけましょう。";
      case "ISTJ": return "あなたの誠実さと完璧な実務能力が「やって当たり前」とされない、正当に評価される環境が必要です。";
      case "ISFJ": return "都合よく使われて「感謝されない環境」で消耗するのは終わり。あなたの優しさが報われる場所を探しましょう。";
      case "ESTJ": return "非効率な組織に絶望するより、あなたの決断力と管理能力が高く買われる環境でトップを目指すべきです。";
      case "ESFJ": return "周囲の空気を読みすぎて疲弊するより、あなたの気配りが直接「ありがとう」に変わる環境を探しましょう。";
      case "ISTP": return "面倒な人間関係や無駄な会議がない、あなたの職人的なスキルと独立性が尊重される環境が必要です。";
      case "ISFP": return "ストレスフルな競争社会で消耗するのはやめて、あなたの美意識とマイペースさを保てる場所を見つけましょう。";
      case "ESTP": return "退屈なデスクワークはあなたを腐らせます。持ち前の行動力とアドリブ力でガンガン稼げる環境を探すべきです。";
      case "ESFP": return "楽しくない仕事に時間を奪われるのは人生の無駄。あなたが一番輝ける、エンタメ性の高い環境を見つけましょう。";
      default: return "あなたの本当の強みが評価され、ストレスなく働ける環境を見つけましょう。";
    }
  };

  const getRomanceText = () => {
    switch(typeKey) {
      case "INTJ": return "感情論でピーチクパーチク騒ぐ相手はNG。あなたの知性を理解し、一人の時間を尊重してくれる相手の見つけ方。";
      case "INTP": return "恋愛の駆け引きはバグでしかありません。あなたのマニアックな話題を楽しんでくれる知的な同志を探しましょう。";
      case "ENTJ": return "無能な相手は論外。あなたの高い基準を満たし、共に成長し合える「最強のパートナー」の見つけ方。";
      case "ENTP": return "束縛されると秒で逃げたくなるあなたへ。知的な刺激を与え合い、常に新しさを楽しめる相手を探しましょう。";
      case "INFJ": return "表面的な付き合いは時間の無駄。あなたの心の奥底にある深い闇と理想を理解してくれる、運命の相手の探し方。";
      case "INFP": return "「誰も分かってくれない」と病む前に。あなたの複雑な感情に優しく寄り添ってくれる、包容力のある相手を見つけましょう。";
      case "ENFJ": return "与えるばかりの重い愛は卒業。あなたの献身を当たり前と思わず、心から感謝してくれる相手を探しましょう。";
      case "ENFP": return "熱しやすく冷めやすいあなたへ。常に新しい刺激と笑いを提供し、一緒にバカができる相手の見つけ方。";
      case "ISTJ": return "エモい雰囲気作りなんて不要です。あなたの誠実さを理解し、ルールと約束を守る安定した相手を探しましょう。";
      case "ISFJ": return "尽くしすぎて疲弊するのはやめましょう。あなたの気配りに気づき、同じくらい大切にしてくれる相手の見つけ方。";
      case "ESTJ": return "感情論で泣かれるのが一番のストレス。あなたの合理的な考えを尊重し、自立した関係を築ける相手を探しましょう。";
      case "ESFJ": return "尽くしても見返りがない恋愛は地獄。あなたの愛を素直に受け取り、全力で愛を返してくれる相手の見つけ方。";
      case "ISTP": return "「私のこと好き？」という確認作業が面倒なあなたへ。言葉より行動で愛を示し、干渉してこない相手を探しましょう。";
      case "ISFP": return "重い将来の話や束縛はNG。今この瞬間の「エモさ」を共有でき、あなたのペースを急かさない相手の見つけ方。";
      case "ESTP": return "面倒な駆け引きや重い束縛は即切り。あなたのフットワークの軽さに同調し、一緒に今を楽しめる相手を探しましょう。";
      case "ESFP": return "チヤホヤされないと死んでしまうあなたへ。常にあなたを褒めちぎり、一緒に人生を楽しんでくれる相手の見つけ方。";
      default: return "あなたの性格に最も適した、ストレスのない理想のパートナーを見つけるための戦略。";
    }
  };

  return (
    <div className="w-full mt-12 mb-8 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">
          {isEn ? "Survival Strategy" : "【処方箋】生存戦略とネクストアクション"}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {isEn 
            ? "Actionable advice based on your true nature." 
            : `本性を暴かれた${typeKey}が、この先絶望せずに生き抜くための具体的なアクション。`}
        </p>
      </div>

      {/* Career CTA */}
      <div className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 hover:border-cyan-500/30">
        <div className="absolute top-0 right-0 p-3 z-10">
          <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 bg-slate-800/80 rounded-md uppercase backdrop-blur-sm border border-slate-700/50">
            PR
          </span>
        </div>
        
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-500/30" />
        
        <div className="relative p-6 sm:p-8 z-10 flex flex-col h-full justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-4 text-cyan-400">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
              {isEn ? "Find your optimal work environment" : `${typeKey}が社会で絶望しないための生存戦略`}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {isEn ? "Discover careers where your unique cognitive functions are valued, not penalized." : getJobText()}
            </p>
          </div>
          
          <Link href="#" className="w-full block">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-900/50 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] transition-all">
              {isEn ? "Explore Careers" : "自分の強みが活きる環境を探す"}
              <ExternalLink size={16} />
            </button>
          </Link>
        </div>
      </div>

      {/* Romance CTA */}
      <div className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-rose-500/10 hover:border-rose-500/30">
        <div className="absolute top-0 right-0 p-3 z-10">
          <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 bg-slate-800/80 rounded-md uppercase backdrop-blur-sm border border-slate-700/50">
            PR
          </span>
        </div>
        
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-rose-500/30" />
        
        <div className="relative p-6 sm:p-8 z-10 flex flex-col h-full justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4 text-rose-400">
              <HeartPulse size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug">
              {isEn ? "Master your relationship dynamics" : `不器用な${typeKey}の恋愛・相性攻略法`}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {isEn ? "Learn how to find partners who appreciate your true self without exhausting you." : getRomanceText()}
            </p>
          </div>
          
          <Link href="#" className="w-full block">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-900/50 hover:from-rose-500 hover:to-pink-500 active:scale-[0.98] transition-all">
              {isEn ? "Find Compatible Partners" : "相性の良いパートナーを探す"}
              <ExternalLink size={16} />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
