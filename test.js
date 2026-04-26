async function test() {
  const body = {
    compositionId: "Top5RankingVideo",
    presetId: "do_not_anger",
    inputProps: {
      title: "Test",
      popDuration: 150,
      entries: [
        { mbtiType: "INTJ", imageUrl: "/characters/INTJ.png", rank: 1, comment: "test" }
      ]
    }
  };

  const res = await fetch("http://localhost:3000/api/render-video", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from("admin:mbti2026").toString("base64")
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("Error:", res.status, await res.text());
    return;
  }

  const data = await res.json();
  console.log("Response:", data);
}

test();
