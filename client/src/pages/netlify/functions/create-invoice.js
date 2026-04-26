const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    const { consultant_id } = JSON.parse(event.body);
    if (!consultant_id) throw new Error('consultant_id is required');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // جلب إعدادات الاشتراك
    const { data: settings, error: settingsError } = await supabase
      .from('subscription_settings')
      .select('price, duration_days')
      .eq('id', 1)
      .single();
    if (settingsError) throw settingsError;

    const price = settings.price;
    const durationDays = settings.duration_days;
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0];
    const invoiceNumber = `INV-${Date.now()}-${consultant_id}`;

    // إنشاء الفاتورة
    const { error: invoiceError } = await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      consultant_id: consultant_id,
      amount: price,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'unpaid',
    });
    if (invoiceError) throw invoiceError;

    // إنشاء الاشتراك
    const { error: subError } = await supabase.from('subscriptions').insert({
      consultant_id: consultant_id,
      start_date: issueDate,
      end_date: dueDate,
      is_active: true,
    });
    if (subError) throw subError;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};