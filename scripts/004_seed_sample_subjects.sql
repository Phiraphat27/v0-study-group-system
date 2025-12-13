-- Insert sample subjects for Thai universities
INSERT INTO public.subjects (subject_code, subject_name, description) VALUES
  ('CS101', 'Introduction to Computer Science', 'Basic concepts of programming and computer science'),
  ('MATH101', 'Calculus I', 'Differential and integral calculus'),
  ('PHYS101', 'General Physics I', 'Mechanics and thermodynamics'),
  ('CHEM101', 'General Chemistry', 'Atomic structure and chemical bonding'),
  ('ENG101', 'English Communication', 'English language skills for academic purposes'),
  ('BUS101', 'Introduction to Business', 'Basic business concepts and principles'),
  ('ECON101', 'Principles of Economics', 'Microeconomics and macroeconomics fundamentals'),
  ('STAT101', 'Statistics', 'Probability and statistical analysis'),
  ('CS201', 'Data Structures', 'Arrays, linked lists, trees, and graphs'),
  ('CS202', 'Database Systems', 'Database design and SQL')
ON CONFLICT (subject_code) DO NOTHING;
