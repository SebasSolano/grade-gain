function generateGroupCode() {
    return Math.random().toString(36).substring(2, 16).toUpperCase();
}

console.log(generateGroupCode())

function calculatePoints(newNote, maxNote, minNote, percentile) {
    if (newNote > maxNote || newNote < minNote) {
      return 0;
    }
    const range = maxNote - minNote;
    const points = Math.round((newNote - minNote) / range * 100 * percentile);
    return points;
  }


  function calculatePoints2(newNote, maxNote, minNote, percentile) {
    if (newNote > maxNote || newNote < minNote) {
        return 0;
      }
    const range = maxNote - minNote;
    let points = Math.round((newNote - minNote) / range * 10 * percentile);
  
    if (newNote == maxNote) {
      points += 1; 
    } else if (newNote == minNote) {
      points -= 1;
    }
  
    return points;
  }

  
  
  // Example
  const newNote = 14;
  const maxNote = 20;
  const minNote = 1;
  const percentile = 0.8;
  const points = calculatePoints2(newNote, maxNote, minNote, percentile);
  console.log("Points: ", points);