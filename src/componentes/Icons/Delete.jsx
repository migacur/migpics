import { PropTypes } from 'prop-types';

const Delete = ({borrarRespuesta,resId}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    onClick={() => borrarRespuesta(resId)}
    className="delete_comment"
    width="22"
    height="22"
    fill="#FF0083"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z" />
  </svg>
  )
}

Delete.propTypes = {
  borrarRespuesta: PropTypes.func.isRequired,
  resId: PropTypes.number.isRequired
};

export default Delete