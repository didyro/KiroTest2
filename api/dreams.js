export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { key } = req.method === 'GET' ? req.query : req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    if (req.method === 'GET') {
      // Return empty dreams array (no persistent storage in demo)
      res.json({ dreams: [] });
    } else if (req.method === 'POST') {
      // Save dream (simulate success but don't persist)
      const { dream } = req.body;
      
      const newDream = {
        ...dream,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        notes: dream.notes || ''
      };
      
      res.json({ success: true, dream: newDream });
    } else if (req.method === 'PUT') {
      // Update dream (simulate success)
      const { dreamId, notes } = req.body;
      
      res.json({ 
        success: true, 
        dream: { 
          id: dreamId, 
          notes, 
          updatedAt: new Date().toISOString() 
        } 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Dreams API error:', error);
    res.status(500).json({ error: 'Operation failed' });
  }
}