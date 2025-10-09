import prettifyDate from '../../utils/prettifyDate';

function Post({ title, text, date, author, numOfComments }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{text}</p>
      <span>Author: {author}</span>
      <span>Posted on {prettifyDate(date)}</span>
      <span>{numOfComments} Comments</span>
    </div>
  );
}

export default Post;
