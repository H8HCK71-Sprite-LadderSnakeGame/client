export default function Board({number, children}) {
    return (
        <>
            <div className="cell bg-white border flex items-center justify-center h-12 w-12 relative">
            {number}
            {children}
            </div>
        </>
    )
}