const { validateEmail, validatePassword } = require("../validation");

test("validates proper email", () => {
    const email = "valid@email.com";
    expect(validateEmail(email)).toBe(true);
})

test("invalidates email without @ in the middle", () => {
    const email = "invalid-email.com";
    expect(validateEmail(email)).toBe(false);
})

test("invalidates email without .something ending", () => {
    const email = "invalid@email";
    expect(validateEmail(email)).toBe(false);
})

test("invalidates email with leading spaces", () => {
    const email = " invalid@email";
    expect(validateEmail(email)).toBe(false);
})

test("invalidates email with trailing spaces", () => {
    const email = "invalid@email ";
    expect(validateEmail(email)).toBe(false);
})

test("invalidates email with spaces", () => {
    const email = " inval id@email";
    expect(validateEmail(email)).toBe(false);
})

test("validates proper password", () => {
    const password = "password12345";
    expect(validatePassword(password)).toBe(true);
})

test("invalidates password longer than 16 characters", () => {
    const password = "password1234567890";
    expect(validatePassword(password)).toBe(false);
})

test("invalidates password shorter than 8 characters", () => {
    const password = "pass";
    expect(validatePassword(password)).toBe(false);
})

test("invalidates password with spaces", () => {
    const password = "pa ss";
    expect(validatePassword(password)).toBe(false);
})