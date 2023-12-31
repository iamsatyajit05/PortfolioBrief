"use client"

function Button({ selectValue, onClickFunction, text }) {
    return <button onClick={onClickFunction} className={`${selectValue === true ? 'bg-white shadow' : ''}  text-black font-medium duration-200 px-4 sm:px-6 py-2 hover:bg-white active:scale-9  rounded-xl`}>{text}</button>
}

export default function Menu({ setSetting, setStock, setRecentNews, setSettingValue, setStockValue, setNewsValue }) {
    return (
        <footer className="m-4 md:m-6 p-4 flex bg-gray-100 text-black rounded-xl sm:rounded-3xl">
            <ul className="flex justify-between sm:justify-start w-full gap-4 text-sm sm:text-base md:text-lg">
                <Button selectValue={setNewsValue} onClickFunction={setRecentNews} text={'Recent News'} />
                <Button selectValue={setStockValue} onClickFunction={setStock} text={'Stocks'} />
                <Button selectValue={setSettingValue} onClickFunction={setSetting} text={'Setting'} />
            </ul>
        </footer>
    );
};