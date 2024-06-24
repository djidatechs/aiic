
const Modal = ({ whid,onClose, children }:{whid?:any,onClose:()=>void,children:any}) => {
  const modalClassName = "fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" ;

  return (
    <div className={modalClassName}>
      <div className="modal-content bg-white p-4 mx-2 md:mx-auto md:w-[80%] max-h-[80%] overflow-auto rounded-xl ">
        {children}
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={onClose}>Aghla9 djedo</button>
      </div>
    </div>
  );
};
export default Modal;
