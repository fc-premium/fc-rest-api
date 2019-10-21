export class UserStats {
    constructor() {
        this.messageCount = null;
        this.signupDate = null;
        this.lastActivity = null;
    }
    get messagesPerDay() {
        if (this.messageCount === null || this.signupDate === null)
            return null;
        const msSinceSignUp = Date.now() - this.signupDate.getTime();
        return this.messageCount / (msSinceSignUp / 1000 / 60 / 60 / 24);
    }
}
