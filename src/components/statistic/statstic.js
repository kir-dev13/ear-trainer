import "./statistic.sass";

const Statistic = ({ answersArray }) => {
    const right = answersArray.filter((item) => item.status === true);
    const wrong = answersArray.filter((item) => item.status === false);
    return (
        <div className="statistic">
            <p>правильных ответов: {right.length}</p>
            <p>неправильных ответов: {wrong.length}</p>
        </div>
    );
};

export default Statistic;
