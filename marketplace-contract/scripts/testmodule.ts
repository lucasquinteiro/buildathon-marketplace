

const main = async () => {
    console.log("MAIN - Pre func");
    await func();
    console.log("MAIN - Post func");
};

const func = async () => {
    console.log("FUNC - In Func");
};

main().then(() => {
    console.log("TODO OK");
}).catch((error) => {
    console.error(error);
    console.log("ERROR");
});

export { func };