
const PageLoading = () => {
  const modalClassName = "fixed inset-0 flex items-center justify-center bg-slate-500/10 bg-opacity-50" ;

  return (
    <div className={modalClassName}>
      <div className="modal-content p-4 rounded-full ">
      <div className={"flex justify-center items-center "}>
            <div className={"w-36 h-36 flex justify-center items-center space-x-12 animate-spin"}>
                <span className="w-12 h-12 bg-red-500  rounded-full  flex justify-center items-center"/>
                <span className="w-12 h-12 bg-red-800  rounded-full  flex justify-center items-center"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
