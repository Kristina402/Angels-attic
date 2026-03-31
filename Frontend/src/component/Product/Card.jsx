import React, { useState  } from "react";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 455,
    minHeight: "50vh",
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: "4px",
    background: "white",
  },
  cardheader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },

  title: {
    marginBottom: "0.5rem",
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  commentTxt: {
    marginBottom: "1rem",
    fontSize: "15px",
    color: "#333",
    lineHeight: "1.5",
    width: "100%",
    wordWrap: "break-word",
  },
  recommend: {
    fontWeight: 700,
  },
  helpful: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },

  thumbIcon: {
    marginRight: "5px",
    marginLeft: "2rem",
    cursor: "pointer",
    fontSize: "1.5rem",
    "&:hover": {
      color: "red",
    },
  },

  subHeadings: {
    fontSize: "16px",
    color: "#414141",
    fontWeight: 700,
  },
  bodyText: {
    fontSize: "14px",
    color: "#414141",
    fontWeight: 500,
  },

  star: {
    color: "black",
    fontSize: 24,
    marginTop: "2px",
  },
  clicked: {
    color: "red",
  },
  yes: {
    color: "green",
  },
  no: {
    color: "red",
  },
}));

const MyCard = ({ review }) => {
  const classes = useStyles();

  const [helpful, setHelpful] = useState(10);
  const [unhelpful, setUnHelpful] = useState(5);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [unhelpfulClicked, setUnhelpfulClicked] = useState(false);

  const helpfulHandler = (type) => {
    if (type === "up" && !helpfulClicked) {
      setHelpful(helpful + 1);
      setHelpfulClicked(true);

      if (unhelpfulClicked) {
        setUnHelpful(unhelpful - 1);
        setUnhelpfulClicked(false);
      }
    } else if (type === "down" && !unhelpfulClicked) {
      setUnHelpful(unhelpful + 1);
      setUnhelpfulClicked(true);

      if (helpfulClicked) {
        setHelpful(helpful - 1);
        setHelpfulClicked(false);
      }
    }
  };

  function formateDate(dateString){
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
    return formattedDate;
  }

  return (
    <div className={classes.cardRoot}>
      <div className={classes.cardheader}>
        <div className={classes.avatarContainer}>
          <Avatar
            alt={review.name}
            src={review.avatar && review.avatar.url}
            className={classes.avatar}
          />
          <Typography variant="body1" className={classes.subHeadings}>
            {review.name}
          </Typography>
        </div>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.bodyText}
        >
          {formateDate(review.createdAt)}
        </Typography>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <Rating
          value={review.rating}
          precision={0.5}
          size="medium"
          readOnly
          className={classes.star}
        />
      </div>
      <Typography variant="h6" className={classes.title}>
        {review.title}
      </Typography>
      <Typography variant="body1" className={classes.commentTxt}>
        {review.comment}
      </Typography>
      <div className={classes.helpful}>
        <Typography
          variant="body2"
          color="textSecondary "
          className={classes.subHeadings}
        >
          Helpful?
        </Typography>
        <ThumbUpIcon
          className={`${classes.thumbIcon} ${
            helpfulClicked ? classes.clicked : ""
          }`}
          onClick={() => helpfulHandler("up")}
        />
        <Typography>{helpful}</Typography>
        <ThumbDownIcon
          className={`${classes.thumbIcon} ${
            unhelpfulClicked ? classes.clicked : ""
          }`}
          onClick={() => helpfulHandler("down")}
        />
        <Typography>{unhelpful}</Typography>
      </div>
    </div>
  );
};
export default MyCard;
