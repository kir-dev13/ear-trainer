const Statistic = ({ answersArray }) => {
    const right = answersArray.filter((item) => item.status === "right");
    const wrong = answersArray.filter((item) => item.status === "wrong");
    return (
        <div>
            <p>right anwers: {right.length}</p>
            <p>wrong answers: {wrong.length}</p>
        </div>
    );
};

export default Statistic;
