function getTitleByHonor(honor) {
    if (honor >= 100) return "Legendary Artist";
    if (honor >= 50) return "Epic Artist";
    if (honor >= 25) return "Great Artist";
    if (honor >= 10) return "Good Artist";
    if (honor >= 5) return "Average Artist";
    return "Newbie Artist";
}

module.exports = { getTitleByHonor };