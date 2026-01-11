export default function Awards() {
    const awards = [
        {
            src: "../src/assets/achivements/icon/americanspaces-300x200-1.jpeg",
            alt: "American Spaces Award"
        },
        {
            src: "../src/assets/achivements/icon/dint.jpg",
            alt: "Dint Award"
        },
        {
            src: "../src/assets/achivements/icon/dire dawa adminstration.jpg",
            alt: "Dire Dawa Administration Award"
        },
        {
            src: "../src/assets/achivements/icon/Ministry_of_Education_(Ethiopia).png",
            alt: "Ministry of Education Ethiopia Award"
        }
    ];

    return (
        <section className="awards-container" id="awards">
            <h1>Awards <span>&</span></h1>
            <h1>Achievements</h1>
            
            <div className="awards-grid">
                {awards.map((award, index) => (
                    <img 
                        key={index}
                        src={award.src}
                        alt={award.alt}
                        loading="lazy" // Lazy loading for performance
                    />
                ))}
            </div>
        </section>
    )
}