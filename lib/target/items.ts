import type { Tuple } from "@/lib/tuple";
import type { Axis, Item, Tiebreaker } from "@/lib/diagnosis/types";

/**
 * 相手診断の設問（仕様書 2-3・2-6、ステップ 2-7）
 *
 * 「あの人」を外から見て答えるので、外から見える行動の文にしている。
 * 軸・向き・並びは自己診断（lib/diagnosis/items.ts）と同じ。選択肢に「わからない」を加える。
 */
export const TARGET_ITEMS: Tuple<Item, 24> = [
  { id: "t01", axis: "EI", keyed: "E", text: "知らない人が多い場でも、あの人は自分から話しかけにいく" },
  { id: "t02", axis: "SN", keyed: "S", text: "説明を受けるとき、あの人は具体的な例を知りたがる" },
  { id: "t03", axis: "TF", keyed: "T", text: "相談をすると、あの人はまず原因と対策を話す" },
  { id: "t04", axis: "JP", keyed: "J", text: "出かける前に、あの人は行き先と時間を決めておきたがる" },
  { id: "t05", axis: "EI", keyed: "I", text: "集まりのあと、あの人は一人になりたそうにしている" },
  { id: "t06", axis: "SN", keyed: "N", text: "話の途中で、あの人は先の展開を予想して口にする" },
  { id: "t07", axis: "TF", keyed: "F", text: "注意されたとき、あの人は内容より言い方を気にする" },
  { id: "t08", axis: "JP", keyed: "P", text: "あの人の休日の予定は、当日に決まることが多い" },
  { id: "t09", axis: "EI", keyed: "E", text: "あの人は、考えがまとまる前から話しながら整理している" },
  { id: "t10", axis: "SN", keyed: "S", text: "あの人の話は、見たことや実際に起きたことが中心だ" },
  { id: "t11", axis: "TF", keyed: "T", text: "話し合いで、あの人は場の空気より理屈を優先する" },
  { id: "t12", axis: "JP", keyed: "J", text: "締め切りのある作業を、あの人は早めに片付ける" },
  { id: "t13", axis: "EI", keyed: "I", text: "あの人は、意見を言う前に少し間を置いてから話す" },
  { id: "t14", axis: "SN", keyed: "N", text: "あの人の話は、たとえや思いつきでよく脇道にそれる" },
  { id: "t15", axis: "TF", keyed: "F", text: "何かを決めるとき、あの人は周りの気持ちを先に気にかける" },
  { id: "t16", axis: "JP", keyed: "P", text: "あの人は、締め切りの直前に一気に片付けるほうだ" },
  { id: "t17", axis: "EI", keyed: "E", text: "休日のあの人は、誰かと出かけていることが多い" },
  { id: "t18", axis: "SN", keyed: "S", text: "あの人は、新しいやり方より慣れたやり方を選びがちだ" },
  { id: "t19", axis: "TF", keyed: "T", text: "迷ったとき、あの人は損得や効率を比べて決める" },
  { id: "t20", axis: "JP", keyed: "J", text: "予定が急に変わると、あの人は少し不機嫌になる" },
  { id: "t21", axis: "EI", keyed: "I", text: "あの人は、大人数より少人数のときのほうがよく話す" },
  { id: "t22", axis: "SN", keyed: "N", text: "あの人は、細かい手順より目的や意味を気にする" },
  { id: "t23", axis: "TF", keyed: "F", text: "相談をすると、あの人はまず気持ちを聞いてくれる" },
  { id: "t24", axis: "JP", keyed: "P", text: "何かを選ぶとき、あの人はあれこれ見比べて時間をかける" },
];

/** 軸スコアが 0 のときに出す2択。画面では「わからない」も選べる */
export const TARGET_TIEBREAKERS: Record<Axis, Tiebreaker> = {
  EI: { prompt: "あの人が元気そうに見えるのはどっち？", first: "人と一緒にいるとき", second: "一人でいるとき" },
  SN: { prompt: "あの人の話し方に近いのはどっち？", first: "起きた出来事を具体的に話す", second: "たとえや考えを交えて話す" },
  TF: { prompt: "あの人が相談に乗るときに近いのはどっち？", first: "解決策を出す", second: "気持ちに寄り添う" },
  JP: { prompt: "あの人の予定の立て方に近いのはどっち？", first: "先に決めておく", second: "その場で決める" },
};
