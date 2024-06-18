import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Avatar } from "../Avatar/Avatar";
import { Comment } from "../Comment/Comment";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";

import styles from "./Post.module.css";
import { PostProps } from "./interfaces";

export function Post({ post }: PostProps) {
  const [comments, setComments] = useState(["Nice!"]);
  const [newComment, setNewComment] = useState("");

  const publishedFormattedDate = format(
    post.publishedAt,
    "MMMM dd, yyyy 'at' hh:mm a",
    {
      locale: enUS,
    },
  );

  const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
    locale: enUS,
    addSuffix: true,
  });

  const isNewCommentEmpty = newComment.length === 0;

  function handleCommentSubmit(event: FormEvent) {
    event.preventDefault();
    setComments([...comments, newComment]);
    setNewComment("");
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewComment(event.target.value);
  }

  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeleted = comments.filter(
      (c) => c !== commentToDelete,
    );
    setComments(commentsWithoutDeleted);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity(
      "Please, write a comment before publishing.",
    );
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={post.author.avatarUrl} />

          <div className={styles.authorInfo}>
            <strong>{post.author.name}</strong>
            <span>{post.author.role}</span>
          </div>
        </div>

        <time
          title={publishedFormattedDate}
          dateTime={post.publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {post.content.map((line) => {
          if (line.type === "paragraph") {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === "link") {
            return (
              <p key={line.content}>
                <a href={line.content}>Click here</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <strong>Give your feedback</strong>
        <textarea
          name="comment"
          value={newComment}
          placeholder="Leave a comment"
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publish
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment
            key={comment}
            content={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </div>
    </article>
  );
}
