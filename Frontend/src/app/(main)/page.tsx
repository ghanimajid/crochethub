import Link from 'next/link'
import { title } from 'process'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--teal-light)',
            color: 'var(--teal)',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: '500',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
            marginBottom: '28px',
          }}>
            ✦ New Masterclass Series
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '4.5rem',
            fontWeight: '700',
            lineHeight: '1.1',
            color: 'var(--text)',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Master the Art <br />
            of the{' '}
            <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>
              Stitch
            </span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1rem',
            lineHeight: '1.75',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '440px',
          }}>
            Go from tangled threads to timeless treasures. Join our vibrant
            community of crafters and learn crochet through step-by-step
            journeys designed for your peace of mind.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/courses" style={{
              backgroundColor: 'var(--maroon)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '500',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              Start Learning →
            </Link>
            <Link href="/patterns" style={{
              border: '1.5px solid var(--border)',
              color: 'var(--text)',
              padding: '14px 32px',
              borderRadius: '100px',
              fontFamily: 'var(--font-inter)',
              fontWeight: '500',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              Browse Patterns
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '40px',
            marginTop: '56px',
            paddingTop: '40px',
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { number: '12,000+', label: 'Active learners' },
              { number: '240+', label: 'Expert courses' },
              { number: '1,400+', label: 'Free patterns' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text)',
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Bento grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <div style={{
  gridColumn: '1 / -1',
  borderRadius: '20px',
  minHeight: '220px',
  overflow: 'hidden',
  position: 'relative',
}}>
  {/* Replace with your own image path like /images/hero-pattern.jpg */}
  <img
    src="/images/course5.jfif"
    alt="Pattern of the day"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  />
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
    padding: '24px',
    color: 'white',
  }}>
    <div style={{
      fontSize: '0.7rem',
      fontFamily: 'var(--font-inter)',
      letterSpacing: '0.1em',
      opacity: 0.8,
      marginBottom: '8px',
    }}>
      PATTERN OF THE DAY
    </div>
    <div style={{
      fontFamily: 'var(--font-cormorant)',
      fontSize: '1.5rem',
      fontWeight: '600',
    }}>
      Granny Squares Mastery
    </div>
    <div style={{
      fontFamily: 'var(--font-inter)',
      fontSize: '0.8rem',
      opacity: 0.7,
      marginTop: '4px',
    }}>
      Intermediate · 2.5 Hours
    </div>
  </div>
</div>

          <div style={{
            backgroundColor: 'var(--maroon-light)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              color: 'var(--maroon)',
              letterSpacing: '0.1em',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              LATEST LESSON
            </div>
            <div style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text)',
              lineHeight: '1.3',
            }}>
              Perfecting the Magic Ring
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--teal-light)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #D0E5E0',
          }}>
            <div style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              color: 'var(--teal)',
              letterSpacing: '0.1em',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              COMMUNITY
            </div>
            <div style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text)',
              lineHeight: '1.3',
            }}>
              1,402 crafters online now
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div style={{
        backgroundColor: 'var(--cream-light)',
        padding: '80px 0',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 48px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Start your creative sanctuary
              </p>
              <h2 style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '2.8rem',
                fontWeight: '700',
                color: 'var(--text)',
              }}>
                Featured Courses
              </h2>
            </div>
            <Link href="/courses" style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}>
              View all courses →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {[
              { title: 'Crochet Fundamentals 101', level: 'Beginner', instructor: 'Sarah Hook', lessons: '8 Lessons',image: '/images/course1.jfif' },
              { title: 'Texture & Colorwork', level: 'Technique', instructor: 'Marco Silk', lessons: '12 Lessons', image: '/images/course2.jfif' },
              { title: 'The Perfect Finishing', level: 'Masterclass', instructor: 'Elena Croft', lessons: '5 Lessons', image: '/images/course3.jfif'},
            ].map((course, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}>
                <div style={{
  height: '200px',
  position: 'relative',
  overflow: 'hidden',
}}>
  <img
    src={course.image}
    alt={course.title}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />

  <div style={{
    position: 'absolute',
    top: '16px',
    right: '16px',
  }}>
    <span style={{
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '4px 12px',
      borderRadius: '100px',
      fontFamily: 'var(--font-inter)',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--text)',
    }}>
      {course.lessons}
    </span>
  </div>
</div>
                <div style={{ padding: '24px' }}>
                  <span style={{
                    backgroundColor: 'var(--cream)',
                    color: 'var(--text-secondary)',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {course.level}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: 'var(--text)',
                    marginBottom: '8px',
                    marginTop: '12px',
                    lineHeight: '1.3',
                  }}>
                    {course.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}>
                    by {course.instructor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        backgroundColor: 'var(--maroon-dark)',
        padding: '100px 48px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '3.5rem',
          fontWeight: '700',
          fontStyle: 'italic',
          color: 'var(--cream)',
          marginBottom: '16px',
        }}>
          Ready to start stitching?
        </h2>
        <p style={{
          fontFamily: 'var(--font-inter)',
          color: '#C4A8A8',
          marginBottom: '40px',
        }}>
          Join thousands of crochet enthusiasts on CrochetHub
        </p>
        <Link href="/register" style={{
          backgroundColor: 'var(--cream)',
          color: 'var(--maroon-dark)',
          padding: '16px 48px',
          borderRadius: '100px',
          fontFamily: 'var(--font-inter)',
          fontWeight: '600',
          textDecoration: 'none',
        }}>
          Join for Free
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: 'var(--cream)',
        borderTop: '1px solid var(--border)',
        padding: '48px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '12px',
            }}>
              CrochetHub
            </div>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: '1.7',
              maxWidth: '240px',
            }}>
              Connecting hobbyists and artists through the timeless art of the single hook.
            </p>
          </div>
          {[
            { title: 'Resources', links: ['Stitch Glossary', 'Yarn Weights', 'Community Guidelines'] },
            { title: 'Studio', links: ['Support', 'Privacy Policy', 'Contact Us'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.7rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '16px',
              }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}>
            © 2025 CrochetHub. Made with patience and one stitch at a time.
          </p>
        </div>
      </div>
    </div>
  )
}