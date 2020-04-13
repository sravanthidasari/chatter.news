const baseUrl = "http://localhost:3003";

export async function getNewsArticlesForToday() {
  let response = await fetch(`${baseUrl}/news`);
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
