const baseUrl = "http://localhost:3003";

export async function getNewsArticlesForToday() {
  let response = await fetch(`${baseUrl}/news`);
  let json = await response.json();

  return json;
}

export async function getArticlesForADate(date) {
  let response = await fetch(`${baseUrl}/news?date=${date.format("YYYY-MM-DD")}`);
  let json = await response.json();

  return json;
}

export async function getNewsArticleDetails(id) {
  let response = await fetch(`${baseUrl}/news/${id}`);
  let json = await response.json();

  return json;
}

export async function addCommentToArticle(articleId, comment, userId) {
  let response = await fetch(`${baseUrl}/news/${articleId}/comments?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      comment: comment
    })
  });
  let json = await response.json();

  return json;
}

export async function getCommentDetails(articleId, commentId) {
  let response = await fetch(`${baseUrl}/news/${articleId}/comments/${commentId}`);
  let json = await response.json();

  return json;
}

export async function addCommentReaction(articleId, commentId, reaction, userId) {
  let response = await fetch(`${baseUrl}/news/${articleId}/comments/${commentId}/reactions?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reaction: reaction
    })
  });

  await response.json();
  const commentDetails = await getCommentDetails(articleId, commentId);
  return commentDetails;
}

export async function addArticleReaction(articleId, reaction, userId) {
  let response = await fetch(`${baseUrl}/news/${articleId}/reactions?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reaction: reaction
    })
  });

  await response.json();
  const articleDetails = await getNewsArticleDetails(articleId);
  return articleDetails;
}

export async function addUser(userId, name) {
  try {
    let response = await fetch(`${baseUrl}/users/${userId}`);
    if (response.status === 200) {
      // We don't need to do anything .. user already exists!
      return;
    }
  } catch (err) {
    console.log(err);
  }

  let response = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: userId,
      name: name
    })
  });

  let json = await response.json();
  return json;
}
